const userFxController = require('../controller/userFxController')

module.exports = (fastify) => {
    fastify.post('/user/attendance', userFxController.UserAttendance);  // 사용자 출석 인증

    fastify.get('/user/attendance', userFxController.UserAttendanceList);  // 사용자 본인 출석 내역 조회

    fastify.get('/user/reward', userFxController.reward);  // 리워드 조회
}