const userFxController = require('../controller/userFxController')

module.exports = (fastify) => {
    fastify.post('/user/attendance', userFxController.UserAttendance);  // 사용자 출석 인증

    fastify.post('/user/attendance2', userFxController.UserAttendanceList);  // 사용자 본인 출석 내역 조회

    fastify.get('/user/reward', userFxController.reward);  // 리워드 조회

    fastify.get('/', userFxController.check);
}