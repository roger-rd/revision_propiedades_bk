SELECT * FROM empresas;

ALTER TABLE empresas
ADD COLUMN IF NOT EXISTS email_notif_agenda TEXT;

UPDATE empresas
SET email_notif_agenda = COALESCE(email_notif_agenda, correo)
WHERE correo IS NOT NULL;

ALTER TABLE empresas
ADD CONSTRAINT empresas_email_notif_agenda_chk
CHECK (email_notif_agenda IS NULL OR position('@' in email_notif_agenda) > 1);