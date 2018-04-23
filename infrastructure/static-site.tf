provider "aws" {
  region = "us-east-1"
}

resource "aws_vpc" "refinebio-frontend-vpc" {
  cidr_block           = "172.31.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags {
    Name = "refinebio-frontend"
  }
}

resource "aws_internet_gateway" "refinebio-frontend" {
  vpc_id = "${aws_vpc.refinebio-frontend-vpc.id}"

  tags = {
    Name = "refinebio-frontend"
  }
}

resource "aws_route_table" "refinebio-frontend" {
  vpc_id = "${aws_vpc.refinebio-frontend-vpc.id}"

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = "${aws_internet_gateway.refinebio-frontend.id}"
  }

  tags {
    Name = "refinebio-frontend"
  }
}

resource "aws_subnet" "refinebio-frontend-1a" {
  availability_zone       = "us-east-1a"
  cidr_block              = "172.31.48.0/20"
  vpc_id                  = "${aws_vpc.refinebio-frontend-vpc.id}"
  map_public_ip_on_launch = true

  tags {
    Name = "refinebio-frontend-1a"
  }
}

resource "aws_subnet" "refinebio-frontend-1b" {
  availability_zone       = "us-east-1b"
  cidr_block              = "172.31.0.0/20"
  vpc_id                  = "${aws_vpc.refinebio-frontend-vpc.id}"
  map_public_ip_on_launch = true

  tags {
    Name = "refinebio-frontend-1b"
  }
}

# resource "aws_iam_user" "refinebio-frontend-deployer" {
#   name = "refinebio-frontend-deployer"
# }

data "aws_iam_policy_document" "refinebio-frontend-deployment" {
  statement {
    actions = [
      "s3:ListObjects",
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
    ]

    resources = [
      "arn:aws:s3:::${aws_s3_bucket.refinebio-frontend-static.id}/*",
    ]
  }

  statement {
    actions = [
      "s3:ListBucket",
    ]

    resources = [
      "arn:aws:s3:::${aws_s3_bucket.refinebio-frontend-static.id}",
    ]
  }
}

# resource "aws_iam_user_policy" "refinebio-frontend-deployer" {
#   name   = "refinebio-frontend-deployer"
#   user   = "${aws_iam_user.refinebio-frontend-deployer.name}"
#   policy = "${data.aws_iam_policy_document.refinebio-frontend-deployment.json}"
# }

# resource "aws_iam_access_key" "refinebio-frontend-deployer-access-key" {
#   user = "${aws_iam_user.refinebio-frontend-deployer.name}"
# }

resource "aws_s3_bucket" "refinebio-frontend-static" {
  bucket = "refinebio-frontend.org"

  cors_rule {
    allowed_origins = ["*"]
    allowed_methods = ["GET"]
    max_age_seconds = 3000
    allowed_headers = ["Authorization"]
  }

  tags {
    Name = "refinebio-frontend Static Files"
  }

  website {
    index_document = "index.html"
  }
}

data "aws_iam_policy_document" "refinebio-frontend-s3-static-access" {
  statement {
    actions = [
      "s3:GetObject",
    ]

    resources = [
      "arn:aws:s3:::${aws_s3_bucket.refinebio-frontend-static.id}/*",
    ]

    principals {
      type        = "AWS"
      identifiers = ["*"]
    }
  }
}

resource "aws_s3_bucket_policy" "refinebio-frontend-s3-static-policy" {
  bucket = "${aws_s3_bucket.refinebio-frontend-static.id}"
  policy = "${data.aws_iam_policy_document.refinebio-frontend-s3-static-access.json}"
}
