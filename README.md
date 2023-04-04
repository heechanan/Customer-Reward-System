# < 쇼핑몰 구매 고객 리워드 시스템 >
# 📄 아키텍처 구성
![image](https://user-images.githubusercontent.com/118877424/227402385-93f24094-9a1d-4bb9-b732-1fc5aa601674.png)

<br/>

# 🎬시나리오 
<details>
<summary>시나리오</summary>

<!-- summary 아래 한칸 공백 두어야함 -->
이커머스 업체인 샵스테이츠는 각종 굿즈를 판매하는 온라인 쇼핑몰을 운영하고 있습니다. 샵스테이츠는 충성 고객에 대한 이벤트를 기획하였습니다.

데일리 출석 이벤트를 제공하여, 꾸준히 방문 인증을 하는 고객에 대해 리워드를 제공하는 것이 목표입니다.

이를 위해서 기존에 잘 운영되고 있던 쇼핑몰 사이트 위에, 데일리 출석 이벤트를 위해 별도의 시스템을 구축하려고자 합니다.
</details>

<details>
<summary>시나리오 상세</summary>

<!-- summary 아래 한칸 공백 두어야함 -->
1. 이벤트 기간 : 2023년 3월 1일 ~ 3월 14일 (사용자는 총 14가지의 리워드 상품(상품고정)을 수령할 수 있다.)
2. 출석에 대한 리워드 수령 관련 내용
~~- **사용자**는 출석인증을 완료한 후 누적된 출석일에 해당하는 리워드 상품을 출석인증 완료와 동시에 상품을 수령할 수 있다.~~
- **사용자**는 출석인증을 통하여 인증용 토큰을 받은후 추가적으로 출석체크를 요청하면서 리워드 상품을 수령한다.  
- 리워드 항목은 아래 14가지로 고정되어 있다.
- 리워드 상품별 수령 횟수는 1회로 제한 된다.
- 🎁 누석 출석일 별 상품 목록
    
    
    | 누적 출석일 | 상 품 명 |
    | --- | --- |
    | 1 | 아이폰 14 |
    | 2 | 에어팟 맥스 2 |
    | 3 | MacBook Pro |
    | 4 | 금 10돈 |
    | 5 | 안희찬과의 데이트권 |
    | 6 | 이승준과의 식사 데이트권 |
    | 7 | 서영준과의 쇼핑 데이트권 |
    | 8 | 이창원과의 데이트권 |
    | 9 | 현금 1000 만원 |
    | 10 | KIA 스포티지 |
    | 11 | 에르메스 핸드백  |
    | 12 | 제네시스 GV80 |
    | 13 | 포르쉐 911 |
    | 14 | 롤스로이스 |
1. **사용자**는 이름/이메일/전화번호를 입력하여 출석 인증을 요청할 수 있다.
- 출석 인증 완료와 동시에 출석횟수 증가(일 1회 제한) 및 리워드 상품 수령
2. **사용자**는 자신의 출석 내역을 조회할 수 있다.
- 이벤트가 시작된 3월 1일 부터의 당일 까지의 출석횟수 조회
3. **사용자**는 본인이 수령가능한 리워드 상품을 조회할 수 있다.
- 리워드 상품 조회 시 누적 출석일별 상품 목록 14가지 조회
4. **리워드 시스템 관리자**는 고객(전체)의 출석 현황을 알 수 있다.
- 전체 고객의 이름, 출석일수를 불러온다.
5. **리워드 시스템 관리자**는 고객의 리워드 현황을 알 수 있다.
- 전체 고객의 이름, 수령한 리워드 내역을 확인 할 수 있다.
6. **리워드 시스템 관리자**는 고객 정보에 문제가 있을 시 수정을 할 수 있다.
7. **리워드 시스템 관리자**는 상품 수량을 임의적으로 수정 할 수 있다.
- 리워드 수량은 0~10 까지 조절할 수 있다. 
8. 사용자가 리워드 상품을 수령 할 때 리워드 상품 수량이 부족할 시 자동적으로 수량이 조절된다.
- 리워드 상품 수량이 3개 이하 까지 소모 됐을 경우 10개로 자동 충전 된다.
9. 리워드 상품 수량이 부족하여 자동 충전됨과 동시에 관리자에게 e-mail 로 충전 완료 메일이 전송된다.
10. ~~예시~~
    1. ~~김코딩  사용자의 출석 및 리워드 상품 수령~~
        - ~~출석 인증 필요 정보
        - name = 김코딩
        - email = asd123@gmail.com
        - phoneNum = 01012341234~~
        - ~~if) 1, 3, 5, 7, 10, 11, 12, 14일 출석
        - 누적 출석일 : 8일
        - 수령 가능 리워드 상품 : 1~8일차까지의 상품~~
</details>

<details>
<summary>인프라 구현 요구사항</summary>

<!-- summary 아래 한칸 공백 두어야함 -->
1. 사용자 인증 시스템과 리워드 시스템은 별개의 도메인으로 설계해야 합니다.
2. 두 개의 시스템은 느슨하게 결합되어야 합니다.
3. 모든 서버는 컨테이너 환경 또는 서버리스로 구현되어야 합니다.
4. 시스템 전반의 가용성을 고려해야 합니다.
5. 리워드 시스템 구현이 CI/CD에 의해 자동화되어야 합니다.
6. IaC화가 진행되어야 합니다.
</details>

<br/>

# 📑기능 정의서
<details>
<summary>기능정의서</summary>

<!-- summary 아래 한칸 공백 두어야함 -->
![image](https://user-images.githubusercontent.com/118877424/229817873-5a9ff210-7ff9-4031-a4f8-59c644a37156.png)

</details>

<details>
<summary>기능 순서도</summary>

<!-- summary 아래 한칸 공백 두어야함 -->
![image](https://user-images.githubusercontent.com/118877424/229822886-bcba4bca-9f65-4a01-99e2-592817a89538.png)

</details>





<br/>

# 💾 DB 테이블 정의서
<details>
<summary>DB Table</summary>

<!-- summary 아래 한칸 공백 두어야함 -->
![image](https://user-images.githubusercontent.com/99157446/226222967-4cda5155-292c-412c-9f81-2431d28540c5.png)
![image](https://user-images.githubusercontent.com/99157446/226222989-223c7e10-1541-4f2f-b646-b058919db1a6.png)
![image](https://user-images.githubusercontent.com/99157446/226233871-824af74a-970a-4900-acdb-5453b50fa2f8.png)

</details>

<br/>


# 🔍 실행 순서 (git clone 이후)
<details>
<summary>실행 순서</summary>

<!-- summary 아래 한칸 공백 두어야함 -->
* 첫번째. login-check-lambda 디렉토리
  1. npm install
  2. sls deploy          
  3. sls dynamodb:seed  // dynamoDB 테이블 생성 (userTable.json 소스 기반)

* 두번째. StockIncreaseLambda 디렉토리
  1. serverless plugin install -n serverless-lift 
  2. sls deploy

* 세번째. Admin-Control-Lambda 디렉토리
  1. sls deploy

* 네번째. clientFunction 디렉토리
  1. 소스코드 수정 후 git push 시 GitAction 을 통하여 설정된 AWS 계정의 ECR 레포지토리로 이미지 업로드 됨
  2. ECS Task 및 Service 의 배포 버전 개정 진행

* 다섯번째. 서비스 이용 (Postman 이용)
  1. 사용자 출석 인증 요청
    => POST : <ECS퍼블릭주소>:3000/user/attendance
    => Body : 인증 정보 입력
```
{
  "email": "asd123@gmail.com",
  "name": "김코딩",
  "phoneNum": "01012341234"
} 
```
출석 체크 완료

![image](https://user-images.githubusercontent.com/118877424/227089909-8f0efc09-2088-4900-a98f-7e08f37c4d53.png)

이미 출석 체크를 완료하여 리워드 보상을 받았을 경우
 
![image](https://user-images.githubusercontent.com/118877424/227089743-c74e8e6e-9d1d-4d4a-b233-cee2e94481f6.png)

사용자 인증정보 틀렸을 경우

![image](https://user-images.githubusercontent.com/118877424/227090291-28398b8e-8b0a-45e2-8b0f-f50765d76700.png)


  2. 사용자 출석 내역 조회 
    => POST : <ECS퍼블릭주소>:3000/user/attendance2
    => Body : 인증 정보 입력 (사용자 출석 인증 요청 시 Body와 동일)
    
 ![image](https://user-images.githubusercontent.com/118877424/227090003-3f8a6078-605f-43f2-8ac6-f0b73622ad32.png)

  
  3. 사용자의 수령 가능 리워드(누적 출석수)조회
    => GET : <ECS퍼블릭주소>:3000/user/reward
    
 ![image](https://user-images.githubusercontent.com/118877424/227089329-f700299d-6b19-450b-ac08-55b2b22d2f97.png)


  4. 리워드 시스템 관리자의 고객 출석 현황 조회
    => GET <Api gateway Endpoint/users/attendance>
![image](https://user-images.githubusercontent.com/99157446/227093462-bf36e88c-0004-447e-a9b1-e1f55caa5d8f.png)
  
  5. 리워드 시스템 관리자의 해당 고객의 리워드 수령 내역 조회
    => GET <Api gateway Endpoint/users/reward>
    ![image](https://user-images.githubusercontent.com/99157446/227094117-75eae7ae-3788-44f3-b044-a504773a6d8b.png)
    
  6. 리워드 시스템 관리자는 리워드의 수량을 조절할 수 있다.
    => PUT <Api gateway Endpoint/rewards
    ![image](https://user-images.githubusercontent.com/99157446/227094509-72851e10-e306-44dd-9996-2b17c0ba6be0.png)


* 여섯번째. 시스템 모니터링(CloudWatch)
  1. DynamoDB로의 접근 횟수에 따라 경보알람 발생 및 이메일 전송
  ![image](https://user-images.githubusercontent.com/118877424/227111679-e733e9ff-a938-4548-96f3-ff97d156d3e7.png)
    
  ![image](https://user-images.githubusercontent.com/118877424/227111459-7010c73c-36fd-4f9e-a7bd-104d8371cd5c.png)


  2. 시간 별 접근 횟수 모니터링
  
![image](https://user-images.githubusercontent.com/118877424/227111391-2fed3f72-d2af-4987-ace9-1b98d3273ee2.png)
</details>


<br/>

# ‼️ 협업 규칙
<details>
<summary>커밋 규칙</summary>
## 1. 커밋 규칙
커밋 명| 내용
-- | --
Create| 신규 생성
Update| 기존 파일 업데이트
Delete| 삭제
Fix| 오류 수정

## 2. Merge 규칙
요구사항에 대한 최소요구 사항 충족시 팀원과의 소통 후 동의하에 머지 진행.

## 3. Branch 정의
Branch 명 | 내용
-- | --
main | 제품으로 출시될 수 있는 브랜치


## 4. 상황 별 Git 조작 순서 및 방법
### git에 익숙하지 않은 팀원들을 위해 작성한 git command 및 조작 방법
* $ git pull : develop 브랜치의 최신 변경사항을 로컬로 가져온다. 
* $ git add <file 명>: git add . 를 통해 모든 파일을 staging area에 추가할 수 있다. 
* $ git commit -m "커밋메세지" 
* $ git push origin <feature branch>: origin(원격 저장소)의 feature branch로 로컬 변경 내역을 push
github에서 develop branch <- feature branch 방향으로  Pull Request 진행

리뷰가 종료되고 모든 팀원의 Approve 된다면 Merge한다. 

----
<!-- summary 아래 한칸 공백 두어야함 -->

</details>
























