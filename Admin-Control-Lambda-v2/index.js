const { DynamoDBClient, UpdateCommand } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");
const express = require("express");
const serverless = require("serverless-http");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const AWS = require('aws-sdk');

const app = express();

const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);
//serverless.yml에서 지정한 테이블 불러오기.
const User_Info_Table = process.env.USERS_TABLE
const Reward_Info_Table = process.env.REWARD_TABLE

app.use(express.json());

//사용자의 출석 조회.
//req.params.userId의 경우 요청을 보낼때 url 에다가 userId를 넣는것
//예시 http://test.com/users/userId/100

//req.body.userId의 경우 요청을 보낼때 body 즉 json으로 보낼때
app.get("/users/attendance", async function (req, res) {
  const params = {
    TableName: User_Info_Table,
    Key: {
      userId: req.body.userId,
    },
  };

  try {
    const { Item } = await dynamoDbClient.send(new GetCommand(params));
    if (Item) {
      const { userId, attDay } = Item;
      res.json({ userId, attDay });
    } else {
      res
        .status(404)
        .json({ error: '해당 사용자를 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive user" });
  }
});

//수령한 리워드 조회.
app.get("/users/reward", async function (req, res) {
  const params = {
    TableName: User_Info_Table,
    Key: {
      userId: req.body.userId,
    },
  };

  try {
    const { Item } = await dynamoDbClient.send(new GetCommand(params));
    if (Item) {
      const { userId, rewardName } = Item;
      res.json({  userId, rewardName });
    } else {
      res
        .status(404)
        .json({ error: '해당 사용자를 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive user" });
  }
});

//reward 수량 조절.

app.put("/rewards", async function (req, res) {
  const { rewardDay, rewardCount } = req.body;
  if (typeof rewardDay !== "string") {
    res.status(400).json({ error: '"rewardDay" must be a string' });
  }    else if (typeof rewardCount !== "string") {
    res.status(400).json({ error: '"rewardCount" must be a number' });
  }

  const params = {
    TableName: Reward_Info_Table,
    Key: {
      'rewardDay': rewardDay
    },
    UpdateExpression: 'ADD rewardCount :val',
    ExpressionAttributeValues: {
      ':val': rewardCount
    }
  };

  try {
    await dynamoDB.update(params).promise();
    res.json({ rewardDay, rewardCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not update reward" });
  }
});



app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});


module.exports.handler = serverless(app);
