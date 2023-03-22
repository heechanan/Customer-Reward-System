# 프로젝트 주제

* ## 쇼핑몰 구매 고객 리워드 시스템


# 아키텍처 구성도
![image](https://user-images.githubusercontent.com/99157446/226222754-f327099e-29ef-47d4-99bb-8637b40af935.png)



# 🎬시나리오 
* ## 각종 굿즈를 판매하는 온라인 쇼핑몰 샵스테이츠에서 사용자들을 위한 이벤트를 진행합니다.

1. 이벤트 기간 : 2023년 3월 16일 ~ 3월 29일 (사용자는 총 14가지의 리워드 상품(상품고정)을 수령할 수 있다.)
2. 출석에 대한 리워드 수령 관련 내용
    >- **사용자**는 출석인증을 통하여 인증용 토큰을 받은후 추가적으로 출석체크를 요청하면서 리워드 상품을 수령한다. 
    >- 리워드 항목은 아래 14가지로 고정되어 있다.
    >- 리워드 상품별 수령 횟수는 1회로 제한 된다.


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
    >- 출석 인증 완료와 동시에 출석횟수 증가(일 1회 제한) 및 리워드 상품 수령
2. **사용자**는 자신의 출석 내역을 조회할 수 있다.
    >- 이벤트가 시작된 3월 1일 부터의 당일 까지의 출석횟수 조회
3. **사용자**는 본인이 수령가능한 리워드 상품을 조회할 수 있다.
    >- 리워드 상품 조회 시 누적 출석일별 상품 목록 14가지 조회
4. **리워드 시스템 관리자**는 고객(전체)의 출석 현황을 알 수 있다.
    >- 전체 고객의 이름, 출석일수를 불러온다.
5. **리워드 시스템 관리자**는 고객의 리워드 현황을 알 수 있다.
    >- 전체 고객의 이름, 수령한 리워드 내역을 확인 할 수 있다.
6. **리워드 시스템 관리자**는 고객 정보에 문제가 있을 시 수정을 할 수 있다.

7. **리워드 시스템 관리자**는 상품 수량을 임의적으로 수정 할 수 있다.
    >- 리워드 수량은 0~10 까지 조절할 수 있다. 
8. 사용자가 리워드 상품을 수령 할 때 리워드 상품 수량이 부족할 시 자동적으로 수량이 조절된다.
    >- 리워드 상품 수량이 3개 이하 까지 소모 됐을 경우 10개로 자동 충전 된다.
9. 리워드 상품 수량이 부족하여 자동 충전됨과 동시에 관리자에게 e-mail 로 충전 완료 메일이 전송된다.

----

# 📑기능 정의서

![image](https://user-images.githubusercontent.com/99157446/226222935-44c305ee-47c3-44e7-9130-304f2d7bdb25.png)


# DB 테이블 정의서

![image](https://user-images.githubusercontent.com/99157446/226222967-4cda5155-292c-412c-9f81-2431d28540c5.png)
![image](https://user-images.githubusercontent.com/99157446/226222989-223c7e10-1541-4f2f-b646-b058919db1a6.png)
![image](https://user-images.githubusercontent.com/99157446/226233871-824af74a-970a-4900-acdb-5453b50fa2f8.png)



# 커밋 규칙
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























