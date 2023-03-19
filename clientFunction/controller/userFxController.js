const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-northeast-2' });
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const date = new Date();
const day = String(date.getDate() - 10);

module.exports = {
  UserAttendance: async (request, reply) => {
    try {
      const { name, email, phoneNum } = request.body;

      const params = {
        TableName: 'userTable',
        Key: {
          'email': email
        }
      };

      const data = await dynamoDb.get(params).promise();
      const user = data.Item;

      if (!user) {
        reply.code(404).send({ message: 'User not found' });
        return;
      }

      // 이름, 이메일, 전화번호가 모두 일치하는지 확인
      if (user.name === name && user.email === email && user.phoneNum === phoneNum) {
        // 사용자의 출석 내역 추가
        const userId = user.userId;

        // 출석일 중복 등록 방지
        const userInfoParams = {
            TableName: 'userInfoTable',
            Key: { 'userId': userId }
        };
        const data_userinfo = await dynamoDb.get(userInfoParams).promise();        

        if (data_userinfo.Item && data_userinfo.Item.attDay && data_userinfo.Item.attDay.includes(day)) {
            reply.code(400).send({ message: "이미 " + name + " 회원님의 " + day + "일차 출석이 확인되었습니다."});
          } else {
            const updateParams = {
              TableName: 'userInfoTable',
              Key: { 'userId': userId },
              UpdateExpression: 'set attDay = list_append(if_not_exists(attDay, :empty_list), :attDay)',
              ConditionExpression: 'attribute_not_exists(attDay) OR not contains(attDay, :day)',
              ExpressionAttributeValues: {
                ':attDay': [day],
                ':empty_list': [],
                ':day': day
              },
              
            };
            await dynamoDb.update(updateParams).promise();
          }

        // 리워드 보상 확인
        const rewardsParams = {
            TableName: 'rewardInfoTable',
            KeyConditionExpression: 'rewardDay = :rewardDay',
            ExpressionAttributeValues: {
              ':rewardDay': String(day)
            }
        };
        // 리워드 데이터 추출
        const rewardsData = await dynamoDb.query(rewardsParams).promise();
        const rewards = rewardsData.Items;


        // reply.code(200).send({ message: rewards});
        reply.code(200).send({ message: name + " 회원님의 출석이 확인되었습니다. 출석 " + day + "일차 리워드 보상은 " + rewards[0].rewardName + " 입니다."});
        // reply.code(200).send(user);
      } else {
        reply.code(404).send({ message: 'User not found' });
      }
    } catch(e) {
      console.error(e);
      reply.code(500).send({ message: e.message });
    }
  },
  UserAttendanceList: async (request, reply) => {
    try {
      return 'test2'
    } catch(e) {
      console.error(e);
      reply.code(500).send({ message: 'Internal Server Error' });
    }
  },
  reward: async (request, reply) => {
    try {
      return 'test3'
    } catch(e) {
      console.error(e);
      reply.code(500).send({ message: 'Internal Server Error' });
    }
  }
};
