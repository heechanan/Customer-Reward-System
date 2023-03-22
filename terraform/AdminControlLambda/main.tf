provider "aws" {
  region = "ap-northeast-2"
}

data "aws_caller_identity" "current" {}

resource "aws_iam_policy" "policy_ACL" {
  name        = "AdminControlLambda-policy"
  description = "AdminControlLambda IAM policy"

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
          "arn:aws:logs:ap-northeast-2:${data.aws_caller_identity.current.account_id}:log-group:/aws/lambda/${aws_lambda_function.lambda_function_admin.function_name}*:*"
        ],
        Effect    = "Allow"
      },
      {
        Action    = [
          "logs:PutLogEvents"
        ],
        Resource  = [
          "arn:aws:logs:ap-northeast-2:${data.aws_caller_identity.current.account_id}:log-group:/aws/lambda/${aws_lambda_function.lambda_function_admin.function_name}*:*:*"
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
        Resource  = [
            "arn:aws:dynamodb:ap-northeast-2:${data.aws_caller_identity.current.account_id}:table/userInfoTable",
            "arn:aws:dynamodb:ap-northeast-2:${data.aws_caller_identity.current.account_id}:table/rewardInfoTable"
        ]
      },
    ]
  })
}

resource "aws_iam_role" "role_ACL" {
  name = "AdminControlLambda-role"

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

resource "aws_iam_role_policy_attachment" "role_policy_ACL" {
  policy_arn = aws_iam_policy.policy_ACL.arn
  role       = aws_iam_role.role_ACL.name
}

resource "aws_lambda_function" "lambda_function_admin" {
  filename         = "${path.module}/Admin-Control-Lambda-v2-dev-api.zip"
  function_name    = "AdminControlLambda"
  handler          = "index.handler"
  runtime          = "nodejs18.x"
  memory_size      = 128
  timeout          = 10
  role             = aws_iam_role.role_ACL.arn
  source_code_hash = filebase64sha256("${path.module}/Admin-Control-Lambda-v2-dev-api.zip")

  environment {
    variables = {
      REWARD_TABLE = "rewardInfoTable",
      USERS_TABLE = "userInfoTable" 
    }
  }
}

resource "aws_api_gateway_rest_api" "api_AdminControlLambda" {
  name = "AdminControlLambda"
}

resource "aws_api_gateway_resource" "resource_AdminControlLambda" {
  rest_api_id = aws_api_gateway_rest_api.api_AdminControlLambda.id
  parent_id   = aws_api_gateway_rest_api.api_AdminControlLambda.root_resource_id
  path_part   = "admin"
}

resource "aws_api_gateway_method" "method_AdminControlLambda" {
  rest_api_id   = aws_api_gateway_rest_api.api_AdminControlLambda.id
  resource_id   = aws_api_gateway_resource.resource_AdminControlLambda.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_deployment" "deploy_AdminControlLambda" {
  rest_api_id   = aws_api_gateway_rest_api.api_AdminControlLambda.id
  depends_on    = [
    aws_api_gateway_integration.integration_AdminControlLambda,
    aws_api_gateway_method_response.response_200
    ]
  stage_name    = "dev"
}

resource "aws_api_gateway_method_response" "response_200" {
  rest_api_id = aws_api_gateway_rest_api.api_AdminControlLambda.id
  resource_id = aws_api_gateway_resource.resource_AdminControlLambda.id
  http_method = aws_api_gateway_method.method_AdminControlLambda.http_method
  status_code = "200"
}

resource "aws_lambda_permission" "permission_AdminControlLambda" {
  statement_id  = "${aws_lambda_function.lambda_function_admin.function_name}_permission"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_function_admin.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn = "${aws_api_gateway_rest_api.api_AdminControlLambda.execution_arn}/*/${aws_api_gateway_method.method_AdminControlLambda.http_method}/${aws_api_gateway_resource.resource_AdminControlLambda.path_part}"
}

resource "aws_api_gateway_integration" "integration_AdminControlLambda" {
  rest_api_id             = aws_api_gateway_rest_api.api_AdminControlLambda.id
  resource_id             = aws_api_gateway_resource.resource_AdminControlLambda.id
  http_method             = aws_api_gateway_method.method_AdminControlLambda.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.lambda_function_admin.invoke_arn
  depends_on = [
    aws_lambda_permission.permission_AdminControlLambda,
  ]
}