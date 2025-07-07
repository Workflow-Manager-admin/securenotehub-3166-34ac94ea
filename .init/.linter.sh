#!/bin/bash
cd /home/kavia/workspace/code-generation/securenotehub-3166-34ac94ea/notes_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

