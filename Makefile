zip:
	(cd functions && zip -r ../functions.zip *)

deploy:
	(cd terraform && terraform plan && terraform apply)
