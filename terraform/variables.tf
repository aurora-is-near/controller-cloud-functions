variable "gcp_project" {
  description = "The GCP project ID."
  default     = "aurora-backstage"
}

variable "gcp_region" {
  description = "The GCP region."
  default     = "us-central1"
}

variable "functions_zip_path" {
  description = "Zip of functions source code"
  default     = "../functions.zip"
}

variable "near_private_key" {
  description = "Near private key used by functions"
  default     = "by8kdJoJHu7uUkKfoaLd2J2Dp1q1TigeWMG123pHdu9UREqPcshCM223kWadm"
}

variable "eth_private_key" {
  description = "Eth private key used by functions"
  default     = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
}

