#!/bin/ash

if [ "$LOAD_SECRETS" = 'true' ]; then
  # Load secrets into environment
  SECRETS=$(configmgmt export_context --context github_glue)

  # Only run the export statments and the
  # command if the secretmgmt command succeeded 
  if [ $? == 0 ]; then
    export $(echo $SECRETS | grep '^export [a-zA-Z0-9_]*=[^ ]*' | sed 's/^export //' | xargs)
    "$@"
  else
    echo "Secrets were not able to be imported"
  fi
else
  echo "Secrets not imported"
  "$@"
fi
