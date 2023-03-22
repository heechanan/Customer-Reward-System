provider "aws" {
  region = "ap-northeast-2"
}

data "aws_caller_identity" "current" {}

resource "aws_iam_policy" "policy_SIL" {
  name        = "StockIncreaseLambda-policy"
  description = "StockIncreaseLambda IAM policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = [
          "logs:CreateLogStream",
          "logs:CreateLogGroup",
          "logs:TagResource"
        ],
        Resource  = [
          "arn:aws:logs:ap-northeast-2:${data.aws_caller_identity.current.account_id}:log-group:/aws/lambda/${aws_lambda_function.lambda_function_stock.function_name}:*"
        ],
        Effect    = "Allow"
      },
      {
        Action    = [
          "logs:PutLogEvents"
        ],
        Resource  = [
          "arn:aws:logs:ap-northeast-2:${data.aws_caller_identity.current.account_id}:log-group:/aws/lambda/${aws_lambda_function.lambda_function_stock.function_name}:*:*"
        ],
        Effect    = "Allow"
      },
      {
        Effect    = "Allow"
        Action    = [
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
        ]
        Resource  = "arn:aws:dynamodb:ap-northeast-2:${data.aws_caller_identity.current.account_id}:table/rewardInfoTable"
      },
      {
        Effect    = "Allow"
        Action    = [
          "sns:Publish",
        ]
        Resource  = "arn:aws:sns:ap-northeast-2:${data.aws_caller_identity.current.account_id}:${aws_sns_topic.topic.name}"
      },
      {
        Effect    = "Allow"
        Action    = [
          "ses:SendEmail",
        ]
        Resource  = "*"
      },
      {
        Effect    = "Allow"
        Action    = [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes"
        ],
        Resource  = "arn:aws:sqs:ap-northeast-2:${data.aws_caller_identity.current.account_id}:${aws_sqs_queue.queue.name}"
        }
    ]
  })
}

resource "aws_iam_role" "role_SIL" {
  name = "StockIncreaseLambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "role_policy_SIL" {
  policy_arn = aws_iam_policy.policy_SIL.arn
  role       = aws_iam_role.role_SIL.name
}

resource "aws_lambda_function" "lambda_function_stock" {
  filename         = "${path.module}/StockIncreaseLambda.zip"
  function_name    = "StockIncreaseLambda"
  handler          = "index.handler"
  runtime          = "nodejs18.x"
  memory_size      = 128
  timeout          = 10
  role             = aws_iam_role.role_SIL.arn
  source_code_hash = filebase64sha256("${path.module}/StockIncreaseLambda.zip")

  environment {
    variables = {
      SNS_INCREASE_ARN = aws_sns_topic.topic.arn
    }
  }
}

resource "aws_lambda_event_source_mapping" "sqs_trigger" {
  event_source_arn = aws_sqs_queue.queue.arn
  function_name    = aws_lambda_function.lambda_function.function_name
}

resource "aws_sns_topic" "topic" {
  name = "Stock_Increase_SNS"
}

resource "aws_sns_topic_subscription" "subscription" {
  topic_arn = aws_sns_topic.topic.arn
  protocol  = "email"
  endpoint  = "vmflr2@gmail.com"
}

resource "aws_sqs_queue" "queue" {
  name = "Stock_Shortage_SQS"
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dlq.arn
    maxReceiveCount     = 10
  })
}

resource "aws_sqs_queue" "dlq" {
  name = "Stock_Shortage_SQS_dlq"
}