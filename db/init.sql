-- =============================================================================
-- init.sql — Initialisation automatique de la base PostgreSQL (Projet 3 / ObRail)
-- =============================================================================
-- Ce fichier est monté dans /docker-entrypoint-initdb.d/ du service `db`
-- (voir docker-compose.yml). PostgreSQL l'exécute AUTOMATIQUEMENT au premier
-- démarrage du conteneur, tant que le volume `db_data` est vide.
--
-- ⚠️ FICHIER PLACEHOLDER — à remplacer par le dump réel du Projet 2 (MSPR2).
--
-- Pour générer le vrai dump (une fois la base source joignable) :
--
--   PGPASSWORD='<mot_de_passe>' pg_dump \
--     --host=<host_source> \
--     --port=<port_source> \
--     --username=<user_source> \
--     --dbname=<base_source> \
--     --no-owner --no-privileges \
--     --clean --if-exists \
--     --schema=public \
--     --file=db/init.sql
--
-- Puis recharger le conteneur :
--   docker compose down -v && docker compose up --build
-- (le `-v` supprime le volume pour forcer la ré-exécution de ce script)
-- =============================================================================

-- Extensions usuelles (décommenter si nécessaire)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- En attendant le dump réel, ce bloc garantit un démarrage sans erreur.
-- Le pg_dump généré ci-dessus écrasera intégralement ce contenu.
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  RAISE NOTICE 'init.sql placeholder exécuté — remplacez ce fichier par le dump pg_dump du Projet 2 (MSPR2).';
END $$;
