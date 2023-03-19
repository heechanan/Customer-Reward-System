const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-northeast-2' });
const dynamoDb = new AWS.DynamoDB.DocumentClient();


module.exports = {
    UserAttendance: async (request, reply) => {
        try{
            const params = {
                TableName: 'AuthenticationDB2',
                Key: {
                'name': '홍길동'
                }
            }

            const data = await dynamoDb.get(params).promise();
            reply.code(200).send(data.Item);

            // return 'test1'
        } catch(e){
            reply.code(404).send(e)
        }
    },
    UserAttendanceList: async (request, reply) => {
        try{
            return 'test2'
        } catch(e){
            reply.code(404).send(e)
        }
    },
    reward: async (request, reply) => {
        try{

            return 'test3'
        } catch(e){
            reply.code(404).send(e)
        }
    }
}