zip:
	(cd functions && zip -r ../functions.zip *)

gcp:
	(cd terraform && terraform plan && terraform apply)
