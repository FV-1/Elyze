#!/usr/bin/env bash
#
# Deux branches de l'app, côte à côte, sur deux émulateurs Android.
#
#   ./scripts/comparer-branches.sh                         # main vs changing-theme
#   ./scripts/comparer-branches.sh main ma-branche         # deux branches au choix
#   ./scripts/comparer-branches.sh --stop                  # tout arrêter
#
# CE QU'IL FAIT, ET POURQUOI AINSI.
#
# Chaque branche est sortie dans un WORKTREE git, hors du dépôt : deux copies
# de travail qui partagent le même historique. C'est la seule façon d'avoir les
# deux versions ouvertes en même temps — un `git checkout` ne donne qu'un état
# à la fois, et changer de branche sous un serveur Metro en marche lui fait
# recharger la moitié des fichiers.
#
# Les `node_modules` ne sont pas réinstallés : un lien symbolique vers ceux du
# dépôt suffit, et évite dix minutes d'installation par branche.
#
# C'EST L'ÉTAT COMMITÉ QUI EST LANCÉ. Le travail non commité de ton répertoire
# principal n'apparaît dans aucune des deux fenêtres : commite-le d'abord, ou
# compare une branche à elle-même après un commit.
#
# Pas de simulateur iOS : il demande Xcode complet, et cette machine n'a que
# les outils en ligne de commande (`xcrun simctl` n'existe pas).

set -euo pipefail

DEPOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ATELIER="${TMPDIR:-/tmp/}"; ATELIER="${ATELIER%/}/elyze-comparaison"
SDK="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
ADB="$SDK/platform-tools/adb"
EMULATEUR="$SDK/emulator/emulator"
PORT_A="${PORT_A:-8081}"
PORT_B="${PORT_B:-8082}"

rouge()  { printf '\033[31m%s\033[0m\n' "$*"; }
vert()   { printf '\033[32m%s\033[0m\n' "$*"; }
gris()   { printf '\033[90m%s\033[0m\n' "$*"; }

# --- Tout arrêter ------------------------------------------------------------
arreter() {
  gris "Arrêt des serveurs sur ${PORT_A} et ${PORT_B}…"
  for p in "$PORT_A" "$PORT_B"; do
    lsof -ti:"$p" 2>/dev/null | xargs kill 2>/dev/null || true
  done
  gris "Les émulateurs restent allumés (ferme-les à la main si tu veux)."
  vert "Arrêté."
}

if [ "${1:-}" = "--stop" ]; then arreter; exit 0; fi

BRANCHE_A="${1:-main}"
BRANCHE_B="${2:-changing-theme}"

# --- Contrôles ---------------------------------------------------------------
[ -x "$ADB" ] || { rouge "adb introuvable dans $SDK. Installe Android Studio, ou règle ANDROID_HOME."; exit 1; }
[ -x "$EMULATEUR" ] || { rouge "emulator introuvable dans $SDK."; exit 1; }

for b in "$BRANCHE_A" "$BRANCHE_B"; do
  git -C "$DEPOT" rev-parse --verify --quiet "$b" >/dev/null \
    || { rouge "La branche « $b » n'existe pas."; exit 1; }
done

if [ -n "$(git -C "$DEPOT" status --porcelain)" ]; then
  gris "Note : ton répertoire de travail a des changements non commités."
  gris "      Ce sont les états COMMITÉS des deux branches qui vont s'ouvrir."
fi

# `mapfile` n'existe pas dans le bash 3.2 que livre macOS : on lit ligne à ligne.
AVDS=()
while IFS= read -r ligne; do [ -n "$ligne" ] && AVDS+=("$ligne"); done < <("$EMULATEUR" -list-avds)
[ "${#AVDS[@]}" -ge 2 ] || { rouge "Il faut deux appareils virtuels ; ${#AVDS[@]} trouvé(s). Crée-les dans Android Studio."; exit 1; }
AVD_A="${AVD_A:-${AVDS[0]}}"
AVD_B="${AVD_B:-${AVDS[1]}}"

# --- Les deux copies de travail ---------------------------------------------
prepare_worktree() {
  local branche="$1" dossier="$ATELIER/${1//\//-}"
  if [ -d "$dossier" ]; then
    git -C "$dossier" checkout --quiet "$branche" 2>/dev/null || true
    git -C "$dossier" reset --hard --quiet "$branche"
  else
    mkdir -p "$ATELIER"
    git -C "$DEPOT" worktree add --force "$dossier" "$branche" >/dev/null
  fi
  # Les dépendances du dépôt, sans les réinstaller.
  [ -e "$dossier/node_modules" ] || ln -s "$DEPOT/node_modules" "$dossier/node_modules"
  echo "$dossier"
}

# --- Les deux émulateurs -----------------------------------------------------
serie_de() {  # le numéro de série d'un AVD déjà allumé, s'il l'est
  local avd="$1"
  for s in $("$ADB" devices | awk '/device$/{print $1}'); do
    [ "$("$ADB" -s "$s" emu avd name 2>/dev/null | head -1 | tr -d '\r')" = "$avd" ] && { echo "$s"; return; }
  done
}

allumer() {
  local avd="$1" serie
  serie="$(serie_de "$avd")"
  if [ -n "$serie" ]; then echo "$serie"; return; fi
  # `nohup` et `disown` : sans eux, l'émulateur meurt avec ce script.
  # Sans `-no-snapshot-save` : l'émulateur garde son état d'une fois sur
  # l'autre, donc Expo Go reste installé et le lancement suivant est immédiat.
  nohup "$EMULATEUR" -avd "$avd" -no-boot-anim >/dev/null 2>&1 &
  disown
  for _ in $(seq 1 60); do
    sleep 5
    serie="$(serie_de "$avd")"
    [ -n "$serie" ] && break
  done
  [ -n "$serie" ] || { rouge "L'émulateur $avd n'a pas démarré."; exit 1; }
  # Attendre que le système soit vraiment prêt, pas seulement visible d'adb.
  for _ in $(seq 1 60); do
    [ "$("$ADB" -s "$serie" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" = "1" ] && break
    sleep 5
  done
  echo "$serie"
}

# --- Un serveur Metro par branche -------------------------------------------
#
# LA FONCTION N'ÉCRIT RIEN SUR SA SORTIE, ET CE N'EST PAS UN DÉTAIL. Appelée
# dans un `$( )`, elle ferait attendre le script jusqu'à ce que PLUS PERSONNE
# ne tienne ce tuyau ouvert — donc jusqu'à l'arrêt du serveur qu'elle vient de
# lancer en tâche de fond. Le chemin du journal est donc calculé par l'appelant.
demarrer() {
  local dossier="$1" port="$2" serie="$3" journal="$4"
  lsof -ti:"$port" 2>/dev/null | xargs kill 2>/dev/null || true
  ( cd "$dossier" && ANDROID_SERIAL="$serie" nohup npx expo start --port "$port" >"$journal" 2>&1 & ) </dev/null >/dev/null 2>&1
  for _ in $(seq 1 60); do
    curl -s "http://localhost:$port/status" 2>/dev/null | grep -q running && return 0
    sleep 2
  done
  rouge "Le serveur du port ${port} n'a pas répondu. Voir $journal"
}

ouvrir() {  # installe Expo Go au besoin, puis ouvre le projet
  local serie="$1" port="$2" hote="$3"
  # EXPO GO, INSTALLÉ DEPUIS LE CACHE. Le CLI le télécharge une fois et le
  # garde dans ~/.expo/android-apk-cache ; on le repose donc sur l'appareil
  # nous-mêmes, plutôt que de laisser `expo start --android` choisir son
  # émulateur — il ignore ANDROID_SERIAL et ouvre sur celui qu'il veut.
  if ! "$ADB" -s "$serie" shell pm list packages 2>/dev/null | grep -q host.exp.exponent; then
    local apk
    apk="$(ls -t "$HOME/.expo/android-apk-cache/"*.apk 2>/dev/null | head -1)"
    if [ -n "$apk" ]; then
      gris "Expo Go manque sur ${serie} : installation depuis le cache…"
      "$ADB" -s "$serie" install -r "$apk" >/dev/null 2>&1 || true
    else
      rouge "Expo Go manque sur ${serie} et aucun APK en cache."
      rouge "Lance une fois « npx expo start --android » pour que le CLI le télécharge."
      return
    fi
  fi
  "$ADB" -s "$serie" shell am start -a android.intent.action.VIEW \
    -d "exp://$hote:$port" >/dev/null 2>&1
}

# --- En piste ----------------------------------------------------------------
HOTE="$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo 127.0.0.1)"

gris "Copies de travail…"
DOSSIER_A="$(prepare_worktree "$BRANCHE_A")"
DOSSIER_B="$(prepare_worktree "$BRANCHE_B")"

gris "Émulateurs ($AVD_A, $AVD_B)…"
SERIE_A="$(allumer "$AVD_A")"
SERIE_B="$(allumer "$AVD_B")"

gris "Serveurs (ports ${PORT_A} et ${PORT_B})…"
JOURNAL_A="$ATELIER/$(basename "$DOSSIER_A").log"
JOURNAL_B="$ATELIER/$(basename "$DOSSIER_B").log"
demarrer "$DOSSIER_A" "$PORT_A" "$SERIE_A" "$JOURNAL_A"
demarrer "$DOSSIER_B" "$PORT_B" "$SERIE_B" "$JOURNAL_B"

gris "Ouverture de l'app sur les deux…"
ouvrir "$SERIE_A" "$PORT_A" "$HOTE"
ouvrir "$SERIE_B" "$PORT_B" "$HOTE"

echo
vert "Les deux versions tournent."
printf '  %-16s %-20s %-18s %s\n' "BRANCHE" "ÉMULATEUR" "PORT" "JOURNAL"
printf '  %-16s %-20s %-18s %s\n' "$BRANCHE_A" "$AVD_A ($SERIE_A)" "$PORT_A" "$JOURNAL_A"
printf '  %-16s %-20s %-18s %s\n' "$BRANCHE_B" "$AVD_B ($SERIE_B)" "$PORT_B" "$JOURNAL_B"
echo
gris "Recharger  : adb -s <série> shell input text RR"
gris "Tout couper: $0 --stop"
