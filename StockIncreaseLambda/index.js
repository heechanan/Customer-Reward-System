const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();
const sns = new AWS.SNS();
const now = new Date();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    const message_body = JSON.stringify(event.Records[0].body);
    const body = JSON.parse(message_body)
    const Body = JSON.parse(body)

    console.log("event: ", Body);

    // 리워드 카운트가 3개 이하일때
    if (Body.rewardCount <= 3) {
      const params = {
        TableName: 'rewardInfoTable',
        Key: {
          'rewardDay': Body.rewardDay
        },
        UpdateExpression: 'ADD rewardCount :val',
        ExpressionAttributeValues: {
          ':val': 10
        }
      };
      console.log("전송시간: ", now.toLocaleString("ko-kr", { timeZone: "Asia/Seoul" }));

      try {
        await dynamoDB.update(params).promise();
        /// 재고 증가 완료 메시지
        const message = `${now.toLocaleString("ko-kr", { timeZone: "Asia/Seoul" })} rewardDay ${Body.rewardDay} 의 ${Body.rewardName} 재고를 ${params.ExpressionAttributeValues[':val']} 개 증가하였습니다.`
        console.log("전송 message: ", message);
        
        ///SNS 메세지 전송
        const snsParams = {
          Message: message,
          TopicArn: process.env.SNS_INCREASE_ARN
          };
        
        await sns.publish(snsParams).promise(); // SNS 메시지 게시
        console.log(`SNS로 메세지를 전송했습니다`);
      } catch (error) {
        console.error(`오류 발생: ${error}`);
      }
    }
};