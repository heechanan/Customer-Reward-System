const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
} = require("@aws-sdk/lib-dynamodb");
const express = require("express");
const serverless = require("serverless-http");

const app = express();

const USER_TABLE = process.env.USER_TABLE;
const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

app.use(express.json());

app.get("/users", async function (req, res) {
  const params = {
    TableName: USER_TABLE,
    Key: {
      email: req.body.email,
    },
  };

  try {
    const { Item } = await dynamoDbClient.send(new GetCommand(params));
    if (Item) {
      const { userId, name, email } = Item;
      res.json({ userId, name, email });
    } else {
      res
        .status(404)
        .json({ error: '"email"을 입력해주세요.' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "존재하지 않는 사용자 입니다." });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});


module.exports.handler = serverless(app);
