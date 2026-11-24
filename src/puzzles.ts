export interface Word {
  /** Uppercase A-Z, 3-10 letters (the daily board is 12x12). */
  word: string
  /** Korean meaning, shown once the word is found. */
  meaning: string
}

export interface Puzzle {
  theme: string
  themeEn: string
  words: Word[]
}

const w = (word: string, meaning: string): Word => ({ word, meaning })

/** Index 0 is puzzle #1 (LAUNCH_DATE in src/lib/day.ts). Exactly 10 words per day. */
export const PUZZLES: Puzzle[] = [
  // #1
  { theme: '과일', themeEn: 'FRUITS', words: [w('APPLE', '사과'), w('BANANA', '바나나'), w('CHERRY', '체리'), w('GRAPE', '포도'), w('LEMON', '레몬'), w('MANGO', '망고'), w('PEACH', '복숭아'), w('PEAR', '배'), w('PLUM', '자두'), w('MELON', '멜론')] },
  // #2
  { theme: '날씨', themeEn: 'WEATHER', words: [w('SUNNY', '화창한'), w('CLOUD', '구름'), w('FOG', '안개'), w('STORM', '폭풍'), w('SNOW', '눈'), w('WIND', '바람'), w('THUNDER', '천둥'), w('RAINBOW', '무지개'), w('FROST', '서리'), w('HUMID', '습한')] },
  // #3
  { theme: '공항에서', themeEn: 'AIRPORT', words: [w('TICKET', '표'), w('GATE', '탑승구'), w('FLIGHT', '항공편'), w('PILOT', '조종사'), w('LUGGAGE', '수하물'), w('PASSPORT', '여권'), w('DELAY', '지연'), w('RUNWAY', '활주로'), w('CUSTOMS', '세관'), w('ARRIVAL', '도착')] },
  // #4
  { theme: '감정', themeEn: 'FEELINGS', words: [w('HAPPY', '행복한'), w('ANGRY', '화난'), w('NERVOUS', '긴장한'), w('PROUD', '자랑스러운'), w('LONELY', '외로운'), w('BORED', '지루한'), w('CALM', '차분한'), w('EXCITED', '신난'), w('JEALOUS', '질투하는'), w('RELIEVED', '안도한')] },
  // #5
  { theme: '주방', themeEn: 'KITCHEN', words: [w('SPOON', '숟가락'), w('FORK', '포크'), w('KNIFE', '칼'), w('PLATE', '접시'), w('BOWL', '그릇'), w('OVEN', '오븐'), w('KETTLE', '주전자'), w('FRIDGE', '냉장고'), w('LADLE', '국자'), w('APRON', '앞치마')] },
  // #6
  { theme: '직업', themeEn: 'JOBS', words: [w('DOCTOR', '의사'), w('NURSE', '간호사'), w('LAWYER', '변호사'), w('CHEF', '요리사'), w('FARMER', '농부'), w('BAKER', '제빵사'), w('DENTIST', '치과의사'), w('SINGER', '가수'), w('ACTOR', '배우'), w('JUDGE', '판사')] },
  // #7
  { theme: '돈과 경제', themeEn: 'MONEY', words: [w('BUDGET', '예산'), w('SALARY', '월급'), w('PROFIT', '이익'), w('LOAN', '대출'), w('DEBT', '빚'), w('STOCK', '주식'), w('TAX', '세금'), w('SAVING', '저축'), w('PRICE', '가격'), w('INCOME', '소득')] },
  // #8
  { theme: '동물', themeEn: 'ANIMALS', words: [w('TIGER', '호랑이'), w('RABBIT', '토끼'), w('EAGLE', '독수리'), w('WHALE', '고래'), w('SHEEP', '양'), w('HORSE', '말'), w('MONKEY', '원숭이'), w('DOLPHIN', '돌고래'), w('TURTLE', '거북'), w('SQUIRREL', '다람쥐')] },
  // #9
  { theme: '우리 몸', themeEn: 'BODY', words: [w('ELBOW', '팔꿈치'), w('ANKLE', '발목'), w('KNEE', '무릎'), w('WRIST', '손목'), w('CHIN', '턱'), w('THUMB', '엄지손가락'), w('SHOULDER', '어깨'), w('EYEBROW', '눈썹'), w('FOREHEAD', '이마'), w('CHEEK', '볼')] },
  // #10
  { theme: '학교', themeEn: 'SCHOOL', words: [w('PENCIL', '연필'), w('ERASER', '지우개'), w('LOCKER', '사물함'), w('EXAM', '시험'), w('GRADE', '성적'), w('TEACHER', '선생님'), w('HOMEWORK', '숙제'), w('LIBRARY', '도서관'), w('RULER', '자'), w('CHALK', '분필')] },
  // #11
  { theme: '겨울', themeEn: 'WINTER', words: [w('SCARF', '목도리'), w('GLOVES', '장갑'), w('MITTEN', '벙어리장갑'), w('SLED', '썰매'), w('ICICLE', '고드름'), w('BLANKET', '담요'), w('HEATER', '난방기'), w('COCOA', '코코아'), w('SKATE', '스케이트'), w('CHILLY', '쌀쌀한')] },
  // #12
  { theme: '채소', themeEn: 'VEGETABLES', words: [w('CARROT', '당근'), w('ONION', '양파'), w('GARLIC', '마늘'), w('POTATO', '감자'), w('CABBAGE', '양배추'), w('PEPPER', '고추'), w('SPINACH', '시금치'), w('CUCUMBER', '오이'), w('PUMPKIN', '호박'), w('CORN', '옥수수')] },
  // #13
  { theme: '가족', themeEn: 'FAMILY', words: [w('MOTHER', '어머니'), w('FATHER', '아버지'), w('SISTER', '여자 형제'), w('BROTHER', '남자 형제'), w('UNCLE', '삼촌'), w('AUNT', '이모·고모'), w('COUSIN', '사촌'), w('NEPHEW', '남자 조카'), w('NIECE', '여자 조카'), w('PARENTS', '부모님')] },
  // #14
  { theme: '색깔', themeEn: 'COLORS', words: [w('RED', '빨간색'), w('BLUE', '파란색'), w('GREEN', '초록색'), w('YELLOW', '노란색'), w('PURPLE', '보라색'), w('ORANGE', '주황색'), w('PINK', '분홍색'), w('BROWN', '갈색'), w('BLACK', '검은색'), w('WHITE', '흰색')] },
  // #15
  { theme: '집', themeEn: 'HOUSE', words: [w('ROOF', '지붕'), w('WINDOW', '창문'), w('DOOR', '문'), w('STAIRS', '계단'), w('CEILING', '천장'), w('FLOOR', '바닥'), w('GARAGE', '차고'), w('BALCONY', '발코니'), w('CHIMNEY', '굴뚝'), w('HALLWAY', '복도')] },
  // #16
  { theme: '스포츠', themeEn: 'SPORTS', words: [w('SOCCER', '축구'), w('TENNIS', '테니스'), w('GOLF', '골프'), w('BOXING', '권투'), w('SWIMMING', '수영'), w('HOCKEY', '하키'), w('CYCLING', '자전거 타기'), w('ARCHERY', '양궁'), w('KARATE', '가라테'), w('RUGBY', '럭비')] },
  // #17
  { theme: '카페', themeEn: 'CAFE', words: [w('COFFEE', '커피'), w('LATTE', '라테'), w('MUG', '머그잔'), w('STRAW', '빨대'), w('SUGAR', '설탕'), w('CREAM', '크림'), w('MUFFIN', '머핀'), w('BAGEL', '베이글'), w('BARISTA', '바리스타'), w('DECAF', '디카페인')] },
  // #18
  { theme: '병원', themeEn: 'HOSPITAL', words: [w('PATIENT', '환자'), w('FEVER', '열'), w('COUGH', '기침'), w('SURGERY', '수술'), w('PILL', '알약'), w('INJURY', '부상'), w('BANDAGE', '붕대'), w('CLINIC', '의원'), w('ALLERGY', '알레르기'), w('RECOVERY', '회복')] },
  // #19
  { theme: '바다', themeEn: 'OCEAN', words: [w('WAVE', '파도'), w('SHELL', '조개껍데기'), w('CORAL', '산호'), w('TIDE', '조수'), w('ISLAND', '섬'), w('SHARK', '상어'), w('OCTOPUS', '문어'), w('ANCHOR', '닻'), w('HARBOR', '항구'), w('SEAWEED', '해초')] },
  // #20
  { theme: '회사', themeEn: 'OFFICE', words: [w('MEETING', '회의'), w('DEADLINE', '마감'), w('MANAGER', '관리자'), w('REPORT', '보고서'), w('PRINTER', '프린터'), w('BOSS', '상사'), w('INTERN', '인턴'), w('PROMOTION', '승진'), w('OVERTIME', '야근'), w('COWORKER', '동료')] },
  // #21
  { theme: '여행', themeEn: 'TRAVEL', words: [w('HOTEL', '호텔'), w('MAP', '지도'), w('TOURIST', '관광객'), w('GUIDE', '안내원'), w('SUITCASE', '여행 가방'), w('BEACH', '해변'), w('SOUVENIR', '기념품'), w('CAMERA', '카메라'), w('JOURNEY', '여정'), w('BACKPACK', '배낭')] },
  // #22
  { theme: '음악', themeEn: 'MUSIC', words: [w('PIANO', '피아노'), w('GUITAR', '기타'), w('DRUM', '북'), w('VIOLIN', '바이올린'), w('MELODY', '멜로디'), w('RHYTHM', '리듬'), w('CHOIR', '합창단'), w('CONCERT', '콘서트'), w('LYRICS', '가사'), w('FLUTE', '플루트')] },
  // #23
  { theme: '옷', themeEn: 'CLOTHES', words: [w('SHIRT', '셔츠'), w('JACKET', '재킷'), w('SKIRT', '치마'), w('JEANS', '청바지'), w('SOCKS', '양말'), w('SWEATER', '스웨터'), w('HOODIE', '후드티'), w('BELT', '벨트'), w('VEST', '조끼'), w('PAJAMAS', '잠옷')] },
  // #24
  { theme: '탈것', themeEn: 'TRANSPORT', words: [w('TRAIN', '기차'), w('SUBWAY', '지하철'), w('TAXI', '택시'), w('TRUCK', '트럭'), w('BICYCLE', '자전거'), w('FERRY', '여객선'), w('SCOOTER', '스쿠터'), w('AIRPLANE', '비행기'), w('TRAM', '노면 전차'), w('VAN', '승합차')] },
  // #25
  { theme: '자연', themeEn: 'NATURE', words: [w('FOREST', '숲'), w('RIVER', '강'), w('MOUNTAIN', '산'), w('VALLEY', '골짜기'), w('DESERT', '사막'), w('CAVE', '동굴'), w('LAKE', '호수'), w('CLIFF', '절벽'), w('MEADOW', '초원'), w('VOLCANO', '화산')] },
  // #26
  { theme: '곤충', themeEn: 'INSECTS', words: [w('ANT', '개미'), w('FLEA', '벼룩'), w('SPIDER', '거미'), w('BEETLE', '딱정벌레'), w('MOTH', '나방'), w('LADYBUG', '무당벌레'), w('CRICKET', '귀뚜라미'), w('MOSQUITO', '모기'), w('BUTTERFLY', '나비'), w('WASP', '말벌')] },
  // #27
  { theme: '빵집', themeEn: 'BAKERY', words: [w('BREAD', '빵'), w('FLOUR', '밀가루'), w('BUTTER', '버터'), w('DOUGH', '반죽'), w('CAKE', '케이크'), w('COOKIE', '쿠키'), w('CROISSANT', '크루아상'), w('TOAST', '토스트'), w('YEAST', '효모'), w('PIE', '파이')] },
  // #28
  { theme: '성격', themeEn: 'PERSONALITY', words: [w('KIND', '친절한'), w('BRAVE', '용감한'), w('SHY', '수줍은'), w('HONEST', '정직한'), w('LAZY', '게으른'), w('CLEVER', '영리한'), w('POLITE', '예의 바른'), w('RUDE', '무례한'), w('GENEROUS', '너그러운'), w('CURIOUS', '호기심 많은')] },
  // #29
  { theme: '시간', themeEn: 'TIME', words: [w('MORNING', '아침'), w('NOON', '정오'), w('EVENING', '저녁'), w('MIDNIGHT', '자정'), w('WEEKEND', '주말'), w('MONTH', '달(월)'), w('YEAR', '해(년)'), w('CENTURY', '세기'), w('MINUTE', '분'), w('SECOND', '초')] },
  // #30
  { theme: '쇼핑', themeEn: 'SHOPPING', words: [w('CART', '카트'), w('RECEIPT', '영수증'), w('DISCOUNT', '할인'), w('REFUND', '환불'), w('CASHIER', '계산원'), w('COUPON', '쿠폰'), w('BRAND', '브랜드'), w('SIZE', '크기'), w('BARGAIN', '싸게 산 물건'), w('WALLET', '지갑')] },
  // #31
  { theme: '컴퓨터', themeEn: 'COMPUTER', words: [w('MOUSE', '마우스'), w('SCREEN', '화면'), w('KEYBOARD', '키보드'), w('LAPTOP', '노트북'), w('PASSWORD', '비밀번호'), w('FOLDER', '폴더'), w('BROWSER', '브라우저'), w('DOWNLOAD', '내려받기'), w('CURSOR', '커서'), w('BATTERY', '배터리')] },
  // #32
  { theme: '크리스마스', themeEn: 'CHRISTMAS', words: [w('SANTA', '산타'), w('GIFT', '선물'), w('REINDEER', '순록'), w('CANDLE', '양초'), w('STOCKING', '크리스마스 양말'), w('CAROL', '캐럴'), w('WREATH', '화환'), w('SLEIGH', '썰매(산타)'), w('ANGEL', '천사'), w('RIBBON', '리본')] },
  // #33
  { theme: '식당', themeEn: 'RESTAURANT', words: [w('MENU', '메뉴'), w('WAITER', '종업원'), w('BILL', '계산서'), w('TIP', '팁'), w('DESSERT', '디저트'), w('ORDER', '주문'), w('STEAK', '스테이크'), w('SOUP', '수프'), w('SALAD', '샐러드'), w('RESERVE', '예약하다')] },
  // #34
  { theme: '하루 일과', themeEn: 'DAILY ROUTINE', words: [w('WAKE', '깨다'), w('WASH', '씻다'), w('COOK', '요리하다'), w('CLEAN', '청소하다'), w('SLEEP', '자다'), w('WALK', '걷다'), w('READ', '읽다'), w('WRITE', '쓰다'), w('LISTEN', '듣다'), w('DRINK', '마시다')] },
  // #35
  { theme: '우주', themeEn: 'SPACE', words: [w('PLANET', '행성'), w('STAR', '별'), w('MOON', '달'), w('ORBIT', '궤도'), w('ROCKET', '로켓'), w('GALAXY', '은하'), w('COMET', '혜성'), w('ASTRONAUT', '우주 비행사'), w('METEOR', '유성'), w('GRAVITY', '중력')] },
  // #36
  { theme: '공원', themeEn: 'PARK', words: [w('BENCH', '벤치'), w('SWING', '그네'), w('SLIDE', '미끄럼틀'), w('FOUNTAIN', '분수'), w('PICNIC', '소풍'), w('KITE', '연'), w('PATH', '오솔길'), w('POND', '연못'), w('LAWN', '잔디밭'), w('JOGGING', '조깅')] },
  // #37
  { theme: '건강', themeEn: 'HEALTH', words: [w('DIET', '식단'), w('EXERCISE', '운동'), w('VITAMIN', '비타민'), w('PROTEIN', '단백질'), w('STRETCH', '스트레칭하다'), w('MUSCLE', '근육'), w('WEIGHT', '체중'), w('HABIT', '습관'), w('CALORIE', '칼로리'), w('YOGA', '요가')] },
  // #38
  { theme: '연말', themeEn: 'YEAR END', words: [w('PARTY', '파티'), w('CHEERS', '건배'), w('FIREWORKS', '불꽃놀이'), w('MEMORY', '추억'), w('GOAL', '목표'), w('COUNTDOWN', '카운트다운'), w('CALENDAR', '달력'), w('WISH', '소원'), w('THANKS', '고마움'), w('REUNION', '재회')] },
  // #39
  { theme: '새해', themeEn: 'NEW YEAR', words: [w('SUNRISE', '해돋이'), w('HOPE', '희망'), w('PLAN', '계획'), w('FRESH', '새로운'), w('START', '시작'), w('LUCK', '행운'), w('PROMISE', '약속'), w('DREAM', '꿈'), w('CHANGE', '변화'), w('BLESSING', '축복')] },
  // #40
  { theme: '도시', themeEn: 'CITY', words: [w('STREET', '거리'), w('BUILDING', '건물'), w('TRAFFIC', '교통'), w('BRIDGE', '다리'), w('TOWER', '탑'), w('SQUARE', '광장'), w('SIDEWALK', '인도'), w('DOWNTOWN', '시내'), w('CORNER', '모퉁이'), w('SUBURB', '교외')] },
  // #41
  { theme: '영화', themeEn: 'MOVIES', words: [w('SCENE', '장면'), w('POPCORN', '팝콘'), w('TRAILER', '예고편'), w('SEQUEL', '속편'), w('HERO', '주인공'), w('VILLAIN', '악당'), w('COMEDY', '코미디'), w('HORROR', '공포'), w('DIRECTOR', '감독'), w('SUBTITLE', '자막')] },
  // #42
  { theme: '새', themeEn: 'BIRDS', words: [w('PARROT', '앵무새'), w('PIGEON', '비둘기'), w('CROW', '까마귀'), w('PENGUIN', '펭귄'), w('OWL', '부엉이'), w('SWAN', '백조'), w('DUCK', '오리'), w('ROBIN', '울새'), w('SPARROW', '참새'), w('FEATHER', '깃털')] },
  // #43
  { theme: '요일과 날', themeEn: 'DAYS', words: [w('MONDAY', '월요일'), w('TUESDAY', '화요일'), w('WEDNESDAY', '수요일'), w('THURSDAY', '목요일'), w('FRIDAY', '금요일'), w('SATURDAY', '토요일'), w('SUNDAY', '일요일'), w('TODAY', '오늘'), w('TOMORROW', '내일'), w('HOLIDAY', '휴일')] },
  // #44
  { theme: '은행', themeEn: 'BANK', words: [w('ACCOUNT', '계좌'), w('DEPOSIT', '예금'), w('CARD', '카드'), w('INTEREST', '이자'), w('BALANCE', '잔액'), w('TRANSFER', '송금'), w('COIN', '동전'), w('CHECK', '수표'), w('TELLER', '은행 창구 직원'), w('ATM', '현금 인출기')] },
  // #45
  { theme: '욕실', themeEn: 'BATHROOM', words: [w('TOWEL', '수건'), w('SOAP', '비누'), w('SHAMPOO', '샴푸'), w('MIRROR', '거울'), w('TOOTHBRUSH', '칫솔'), w('BATHTUB', '욕조'), w('SHOWER', '샤워'), w('RAZOR', '면도기'), w('COMB', '빗'), w('TOILET', '변기')] },
  // #46
  { theme: '맛', themeEn: 'TASTE', words: [w('SWEET', '달콤한'), w('SALTY', '짠'), w('SOUR', '신'), w('BITTER', '쓴'), w('SPICY', '매운'), w('CRISPY', '바삭한'), w('JUICY', '즙이 많은'), w('BLAND', '싱거운'), w('CHEWY', '쫄깃한'), w('GREASY', '기름진')] },
  // #47
  { theme: '농장', themeEn: 'FARM', words: [w('BARN', '헛간'), w('COW', '소'), w('PIG', '돼지'), w('GOAT', '염소'), w('HEN', '암탉'), w('TRACTOR', '트랙터'), w('HARVEST', '수확'), w('FENCE', '울타리'), w('WHEAT', '밀'), w('HAY', '건초')] },
  // #48
  { theme: '과학', themeEn: 'SCIENCE', words: [w('ATOM', '원자'), w('ENERGY', '에너지'), w('MAGNET', '자석'), w('OXYGEN', '산소'), w('LAB', '실험실'), w('THEORY', '이론'), w('MICROSCOPE', '현미경'), w('EXPERIMENT', '실험'), w('DATA', '자료'), w('CELL', '세포')] },
  // #49
  { theme: 'SNS', themeEn: 'SOCIAL MEDIA', words: [w('FOLLOW', '팔로우하다'), w('LIKE', '좋아요'), w('SHARE', '공유하다'), w('POST', '게시물'), w('COMMENT', '댓글'), w('VIDEO', '영상'), w('PROFILE', '프로필'), w('HASHTAG', '해시태그'), w('STREAM', '생방송하다'), w('VIRAL', '입소문 난')] },
  // #50
  { theme: '움직임', themeEn: 'MOVES', words: [w('RUN', '달리다'), w('JUMP', '뛰다'), w('CLIMB', '오르다'), w('SWIM', '헤엄치다'), w('THROW', '던지다'), w('CATCH', '잡다'), w('KICK', '차다'), w('PUSH', '밀다'), w('PULL', '당기다'), w('LIFT', '들어 올리다')] },
  // #51
  { theme: '음료', themeEn: 'DRINKS', words: [w('WATER', '물'), w('JUICE', '주스'), w('MILK', '우유'), w('TEA', '차'), w('SODA', '탄산음료'), w('SMOOTHIE', '스무디'), w('LEMONADE', '레모네이드'), w('BEER', '맥주'), w('WINE', '와인'), w('SHAKE', '셰이크')] },
  // #52
  { theme: '정원', themeEn: 'GARDEN', words: [w('FLOWER', '꽃'), w('SEED', '씨앗'), w('ROSE', '장미'), w('TULIP', '튤립'), w('SHOVEL', '삽'), w('LEAF', '잎'), w('ROOT', '뿌리'), w('SOIL', '흙'), w('BLOSSOM', '꽃(나무의)'), w('WEED', '잡초')] },
  // #53
  { theme: '가구', themeEn: 'FURNITURE', words: [w('SOFA', '소파'), w('CHAIR', '의자'), w('TABLE', '탁자'), w('BED', '침대'), w('SHELF', '선반'), w('DRAWER', '서랍'), w('CLOSET', '옷장'), w('CABINET', '수납장'), w('CUSHION', '쿠션'), w('LAMP', '램프')] },
  // #54
  { theme: '뉴스', themeEn: 'NEWS', words: [w('HEADLINE', '헤드라인'), w('ARTICLE', '기사'), w('REPORTER', '기자'), w('INTERVIEW', '인터뷰'), w('ELECTION', '선거'), w('WEATHER', '날씨'), w('ECONOMY', '경제'), w('CRIME', '범죄'), w('RUMOR', '소문'), w('ISSUE', '쟁점')] },
  // #55
  { theme: '축제', themeEn: 'FESTIVAL', words: [w('PARADE', '퍼레이드'), w('COSTUME', '의상'), w('MASK', '가면'), w('LANTERN', '등불'), w('DANCE', '춤'), w('CROWD', '군중'), w('STAGE', '무대'), w('BALLOON', '풍선'), w('TRADITION', '전통'), w('FOOD', '음식')] },
  // #56
  { theme: '투자', themeEn: 'INVESTING', words: [w('INVEST', '투자하다'), w('MARKET', '시장'), w('DIVIDEND', '배당금'), w('RISK', '위험'), w('TREND', '추세'), w('BOND', '채권'), w('FUND', '펀드'), w('ASSET', '자산'), w('CRASH', '폭락'), w('RALLY', '반등')] },
  // #57
  { theme: '자동차', themeEn: 'CAR', words: [w('ENGINE', '엔진'), w('WHEEL', '바퀴'), w('BRAKE', '브레이크'), w('TIRE', '타이어'), w('HORN', '경적'), w('SEATBELT', '안전벨트'), w('GAS', '휘발유'), w('PARKING', '주차'), w('LICENSE', '면허'), w('DRIVER', '운전자')] },
  // #58
  { theme: '반려동물', themeEn: 'PETS', words: [w('PUPPY', '강아지'), w('KITTEN', '새끼 고양이'), w('HAMSTER', '햄스터'), w('LEASH', '목줄'), w('COLLAR', '목걸이'), w('CAGE', '우리'), w('BARK', '짖다'), w('TAIL', '꼬리'), w('PAW', '동물 발'), w('GOLDFISH', '금붕어')] },
  // #59
  { theme: '친구', themeEn: 'FRIENDSHIP', words: [w('FRIEND', '친구'), w('TRUST', '신뢰'), w('SECRET', '비밀'), w('ADVICE', '조언'), w('HUG', '포옹'), w('LAUGH', '웃다'), w('SUPPORT', '지지'), w('LOYAL', '의리 있는'), w('TEASE', '놀리다'), w('CHAT', '수다 떨다')] },
  // #60
  { theme: '공구', themeEn: 'TOOLS', words: [w('HAMMER', '망치'), w('NAIL', '못'), w('SAW', '톱'), w('DRILL', '드릴'), w('WRENCH', '렌치'), w('SCREW', '나사'), w('LADDER', '사다리'), w('TAPE', '테이프'), w('GLUE', '풀'), w('ROPE', '밧줄')] },
]
