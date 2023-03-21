const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION });
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const date = new Date();
const day = String(date.getDate() - 10);

rewardDays_list = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"];

module.exports = { 
  check: async (request, reply) => {
    return;
  },
  
  UserAttendance: async (request, reply) => {
    try {
      const { name, email, phoneNum } = request.body;
 
      // userTable
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

      // rewardInfoTable
      const rewardsParams = {
        TableName: 'rewardInfoTable',
        KeyConditionExpression: 'rewardDay = :rewardDay',
        ExpressionAttributeValues: {
          ':rewardDay': String(day) 
        }
      };
      // rewardInfoTable 리워드 데이터 추출
      const rewardsData = await dynamoDb.query(rewardsParams).promise();
      const rewards = rewardsData.Items;


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

        // 이미 출석체크를 했을경우
        if (data_userinfo.Item && data_userinfo.Item.attDay && data_userinfo.Item.attDay.includes(day)) {
            reply.code(400).send({ message: "이미 " + name + " 회원님의 " + day + "일차 출석이 확인되었습니다."});
            // 출석일 중복 등록 방지 끝
          } else {  // 금일 처음으로 출석체크를 하는 경우
            // 사용자 출석 내역 추가 (출석일 + 획득 보상 목록)
            const updateParams = {
              TableName: 'userInfoTable',
              Key: { 'userId': userId },
              UpdateExpression: 'set attDay = list_append(if_not_exists(attDay, :empty_list), :attDay), rewardName = :rewardName',
              ConditionExpression: 'attribute_not_exists(attDay) OR not contains(attDay, :day)',
              ExpressionAttributeValues: {
                ':attDay': [day],
                ':empty_list': [],
                ':day': day,
                ':rewardName': [rewards[0].rewardName],
                // ':rewardCount': rewards[0].rewardCount -1
              },
            };
            await dynamoDb.update(updateParams).promise();
            
            // 리워드 개수 소모 (-1)
            const updateParams2 = {
              TableName: 'rewardInfoTable',
              Key: { 'rewardDay': day },
              UpdateExpression: 'set rewardCount = :rewardCount',
              ExpressionAttributeValues: {
                ':rewardCount': rewards[0].rewardCount -1
              },
            };
            await dynamoDb.update(updateParams2).promise();


            
            // 리워드 보상의 재고가 3개 이하가 됐을 경우 알람을 보내야함

            if (rewards[0].rewardCount - 1 <= 3) {
              const sqs = new AWS.SQS({ region: 'ap-northeast-2' }); // SQS 리전 설정
            
              const params = {
              // MessageBody: rewards[0].rewardName + ' 상품의 재고가 3개 이하가 됐습니다.',
              MessageBody: JSON.stringify({
                rewardDay: rewards[0].rewardDay,
                rewardCount: rewards[0].rewardCount-1,
                rewardName: rewards[0].rewardName
              }),
              QueueUrl: process.env.SQS_QUEUE_URL // SQS 큐 URL 설정
              };
            
              sqs.sendMessage(params, (err, data) => {
                if (err) {
                  console.error(err);
                } else {
                  console.log('Message sent to SQS:', data.MessageId);
                }
              });
            }
        }
        



        // reply.code(200).send({ message: rewards});
        reply.code(200).send({ message: name + " 회원님의 출석이 확인되었습니다. 출석 " + day + "일차 리워드 보상은 " + rewards[0].rewardName + " 입니다."});
        // reply.code(200).send(user);
      } else {
        reply.code(404).send({ message: 'Check your information' });
      }
    } catch(e) {
      console.error(e);
      reply.code(500).send({ message: e.message });
    }
  },


  UserAttendanceList: async (request, reply) => {   // 사용자 출석 내역 조회
    try {
      const { name, email, phoneNum } = request.body;

      // userTable
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

      const userInfoParams = {
        TableName: 'userInfoTable',
        Key: { 'userId': user.userId }
      };
      const userinfo = await dynamoDb.get(userInfoParams).promise();   
      const rewardsList = userinfo.Item;

      reply.code(200).send({ message: name + " 님의 누적 출석 날짜는 총 " + rewardsList.attDay.length + " 일 입니다." });
    } catch(e) {
      console.error(e);
      reply.code(500).send({ message: 'Check your information' });
    }
  },


  reward: async (request, reply) => {    // 리워드 보상 목록 조회

    try {
      const rewardParams2 = {
        RequestItems: {
          'rewardInfoTable': {
            Keys: rewardDays_list.map(rewardDay => {
              return { 'rewardDay': String(rewardDay) };
            })
          }
        }
      };
      const reward_data = await dynamoDb.batchGet(rewardParams2).promise();
      const sorted_reward_data = reward_data.Responses.rewardInfoTable.sort((a, b) => {
        return a.rewardDay - b.rewardDay;
      });
      const reward_names = sorted_reward_data.map((item, index) => `${item.rewardDay} 일차 보상 :  ${item.rewardName}`);
      reply.code(200).send({ message: reward_names });
    } catch(e) {
      console.error(e);
      reply.code(400).send({ message: 'Error' });
    }
  }
};
