import { useState, useEffect, useRef } from "react";

// ─── TRANSLATIONS ───
const LANGS = {
  uz: {
    code:"uz", label:"O'zbekcha", flag:"🇺🇿",
    login:"Kirish", register:"Ro'yxatdan o'tish", phone:"Telefon raqam", password:"Parol",
    confirmPass:"Parolni tasdiqlang", forgotPass:"Parolni unutdingiz?",
    orWith:"yoki", googleLogin:"Google orqali kirish",
    noAccount:"Hisobingiz yo'qmi?", haveAccount:"Hisobingiz bormi?",
    name:"Ism", surname:"Familiya", createAccount:"Hisob yarating va o'rganishni boshlang",
    hello:"Assalomu alaykum,", home:"Bosh sahifa", todayResult:"Bugungi natija", allBtn:"Barchasi →",
    active:"Faollar", tests:"Testlar", rating:"Reyting",
    tickets:"Biletlar", ticketsSub:"100 ta bilet", testsSub:"Cheksiz savol",
    exam:"Imtihon", examSub:"Rasmiy test", stats:"Statistika", statsSub:"Natijalaringiz",
    ratingSub:"Top Natijalar", profile:"Profil", profileSub:"Sozlamalar",
    todayGoal:"Bugungi maqsad", lastActivity:"Oxirgi faoliyat",
    allTickets:"100 ta bilet mavjud", bookmarked:"Saqlangan",
    allTab:"Barchasi", done:"Yakunlangan", undone:"Yakunlanmagan",
    questions:"ta savol", questionOf:"Savol",
    back:"Orqaga", next:"Keyingi", finish:"Tugatish", explanation:"Izoh", explanationTitle:"To'g'ri javob izohi", noExplanation:"Bu savol uchun izoh qo'shilmagan.",
    greatResult:"Zo'r natija!", failed:"Muvaffaqiyatsiz",
    ticketDone:"yakunlandi", otherTicket:"Boshqa bilet tanlash", goHome:"Bosh sahifaga qaytish",
    infiniteTest:"Cheksiz test", infiniteSub:"Barcha savollar aralash holda keladi", startTest:"Testni boshlash",
    currentSeries:"Joriy seriya", bestSeries:"Eng yaxshi seriya", rightAnswer:"to'g'ri javob",
    lastResults:"So'nggi natijalar", byTopic:"Mavzular bo'yicha", hardQ:"Qiyin savollar",
    examTitle:"Imtihon", examReady:"Rasmiy imtihonga tayyorlik",
    examRules:"Imtihon qoidalari",
    rule1:"20 ta savol beriladi", rule2:"Har bir savolga 1 daqiqa",
    rule3:"2 tadan ortiq xato bo'lsa imtihondan o'ta olmaysiz",
    rule4:"Imtihon yakunida natija va statistika ko'rsatiladi",
    questionCount:"Savollar", time:"Vaqt", errorLimit:"Xato limit",
    startExam:"Imtihonni boshlash", question:"Savol", errors:"Xatolar",
    congrats:"Tabriklaymiz! 🎉", examPassed:"Imtihondan muvaffaqiyatli o'tdingiz.",
    examFailed:"Imtihondan o'ta olmadingiz", tooManyErrors:"tadan ortiq xato qayd etildi.",
    correct:"To'g'ri javob", wrong:"Noto'g'ri javob", result:"Natija",
    avgResult:"O'rtacha natija", examCount:"Imtihonlar soni",
    passedExams:"O'tgan imtihonlar", failedExams:"O'tmagan imtihonlar",
    retryExam:"Qayta urinish",
    statistics:"Statistika", general:"Umumiy", weekly:"Haftalik", monthly:"Oylik", yearly:"Yillik",
    totalQ:"Jami savollar", correctA:"To'g'ri javoblar", wrongA:"Noto'g'ri javoblar", correctPct:"To'g'ri foizi",
    resultsGraph:"Natijalar grafigi",
    statsMistakesTitle:"Mavzular bo'yicha xatolar",
    statsMistakesSub:"Qaysi mavzuda ko'proq xato qilayotganingizni ko'ring",
    statsMistakePct:"xato",
    statsRecommendTitle:"Tavsiya",
    statsRecommendBefore:"Xatolaringizning katta qismi",
    statsRecommendAfter:"mavzusiga to'g'ri kelmoqda ({pct}%). Shu mavzu bo'yicha ko'proq mashq qiling!",
    statsPracticeBtn:"Mashq qilish",
    ratingTitle:"Reyting", daily:"Kunlik",
    ratingEmpty:"Hali natijalar yo'q",
    loading:"Yuklanmoqda...",
    certs:"Sertifikatlarim", settings:"Sozlamalar", lang:"Til", about:"Biz haqimizda", news:"Yangiliklar", logout:"Chiqish",
    pro:"Pro obuna", support:"Qo'llab-quvvatlash", share:"Ulashish",
    referral:"Referal", referralTitle:"Do'stlarni taklif qiling",
    referralSub:"Har bir taklif uchun mukofot oling",
    referralCode:"Sizning referal kodingiz",
    referralCopy:"Nusxalash", referralCopied:"Nusxalandi!",
    referralShare:"Do'stlarga ulashish",
    referralStats:"Statistika", referralInvited:"Taklif qilingan",
    referralEarned:"Qo'lga kiritilgan mukofotlar",
    referralProgress:"Keyingi mukofotga",
    referralHowTitle:"Qanday ishlaydi?",
    referralStep1:"Referal kodingizni do'stlarga yuboring",
    referralStep2:"Do'stingiz kod bilan ro'yxatdan o'tadi",
    referralStep3:"Chegara to'lganda Pro sovg'a olasiz",
    referralRewards:"Mukofot darajalari",
    referralHistory:"Taklif tarixi",
    referralPending:"Kutilmoqda",
    referralGifted:"Sovg'a berildi",
    proTitle:"Nazariy PRO", proSubtitle:"Imtihonga eng yaxshi tayyorgarlik ko'ring",
    proNoAds:"Reklama yo'q", proNoAdsSub:"Hech qanday reklama ko'rmaysiz",
    proUnlimited:"Cheksiz testlar", proUnlimitedSub:"Barcha bilet va testlarga to'liq kirish",
    proStats:"Batafsil statistika", proStatsSub:"Kuchli va zaif tomonlaringizni biling",
    proMonthly:"Oylik obuna", proCancel:"Istalgan vaqt bekor qilish mumkin",
    proSubscribe:"Obuna bo'lish", proSecure:"To'lov xavfsiz va himoyalangan", proChoosePay:"To'lov usulini tanlang",
    proWeekly:"Haftalik", proMonth1:"1 oylik", proMonth2:"2 oylik",
    proPaymentTitle:"To'lovni amalga oshiring",
    proSavingPct:"tejaydingiz",
    proPayToCard:"Quyidagi kartaga o'tkazing",
    proCardOwner:"KARTA EGASI",
    proCopyCardBtn:"Karta raqamini nusxalash",
    proUploadReceiptTitle:"To'lov chekini yuboring",
    proUploadReceiptDesc:"Pul o'tkazgandan so'ng screenshot yoki chek faylini yuklang",
    proUploadFileBtn:"Fayl yuklash",
    proFileTypes:"Screenshot yoki PDF • JPG, PNG, PDF",
    proChooseAnotherFile:"Boshqa fayl tanlash",
    proSendReceiptBtn:"Chekni yuborish",
    proDataSecure:"Ma'lumotlaringiz xavfsiz",
    proCheckingTitle:"Tekshirilmoqda...",
    proCheckingDesc1:"To'lov chekingiz adminga yuborildi.",
    proCheckingDesc2:"Tasdiqlangach bildirishnoma keladi.",
    proPaymentDetails:"To'lov tafsilotlari",
    proTariff:"Tarif", proStatus:"Holat",
    proUploadedReceipt:"Yuklangan chek:",
    proAdminCheckDesc1:"Admin to'lovni tekshirib, bildirishnoma orqali xabardor qiladi. Odatda",
    proAdminCheckDesc2:"ichida tasdiqlanadi.",
    proMinutes:"daqiqa",
    proPopular:"Mashhur", proBest:"Tejamli",
    exams:"Imtihonlar", passed:"O'tgan", notPassed:"O'tmagan",
    darkMode:"Tungi rejim", lightMode:"Kunduzgi rejim",
    notifications:"Bildirishnomalar", notifEmpty:"Bildirishnomalar yo'q",
    notifAll:"Barchasi", notifUnread:"O'qilmagan",
    markAllRead:"Barchasini o'qilgan deb belgilash",
    notifSettings:"Bildirishnoma sozlamalari",
    notifDaily:"Kunlik eslatma", notifResult:"Natija haqida",
    notifNew:"Yangi bilet", notifExam:"Imtihon eslatmasi",
    notifOn:"Yoqilgan", notifOff:"O'chirilgan",
    justNow:"Hozir", minsAgo:"daqiqa oldin", hoursAgo:"soat oldin", daysAgo:"kun oldin", yesterday:"Kecha",
    savedQ:"Saqlanganlar", savedEmpty:"Hali saqlanganlar yo'q",
    savedSub:"Savollarni bookmark qilib saqlang",
    savedCount:"ta saqlangan savol", removeBookmark:"Olib tashlash",
    practiceAll:"Hammasini mashq qilish", ticket:"Bilet",
    bookmarkAdded:"Savol saqlandi!", bookmarkRemoved:"Savol o'chirildi",
    skip:"O'tkazib yuborish", getStarted:"Boshlash", continue:"Davom etish",
    ob1Title:"Nazariy bilan o'rganing!",   ob1Sub:"100 ta bilet va minglab savollar orqali haydovchilik imtihoniga tayyorlaning.",
    ob2Title:"Bilet va testlar",           ob2Sub:"Har bir biletda 20 ta savol. Cheksiz test rejimi bilan bilimingizni sinab ko'ring.",
    ob3Title:"Imtihon rejimi",             ob3Sub:"Rasmiy imtihon sharoitida mashq qiling. Xato limitiga rioya qilib, natijangizni oshiring.",
    ob4Title:"Natija va reyting",          ob4Sub:"O'z natijangizni kuzating, reyting jadvalida o'z o'rningizni toping!",
    search:"Qidirish", searchPlaceholder:"Bilet, savol yoki mavzu...",
    searchResults:"Natijalar", noResults:"Hech narsa topilmadi",
    filterAll:"Barchasi", filterTickets:"Biletlar", filterQuestions:"Savollar",
    searchHint:"Bilet raqami yoki kalit so'z kiriting",
    topics:"Mavzular", topicsSub:"Bo'limlar bo'yicha o'rganish",
    rules:"Yo'l Qoidalari", rulesSub:"PBX qoidalari",
    rulesSections:"bo'lim", rulesSigns:"ta belgi",
    topicsTitle:"Mavzular bo'yicha o'rganish",
    rulesTitle:"Yo'l Harakati Qoidalari",
    duel:"Duel", duelSub:"Do'sting bilan bellash",
    duelActive:"Faol duels", duelHistory:"Tarix",
    duelInvite:"Do'stni duelga taklif qilish",
    duelWaiting:"Do'stingiz hali testni ishlamadi",
    duelYourTurn:"Sizning navbatingiz",
    duelStart:"Testni boshlash",
    duelWin:"G'alaba", duelLoss:"Mag'lubiyat",
    duelTie:"Durrang",
    duelSubmitted:"Javoblaringiz yuborildi!",
    duelYou:"Siz",
    duelWaitingForOpponent:"Raqib kutilmoqda",
    duelWaitingOpponentResult:"Raqibingiz hali javob bermadi. Natija u tugatgach yangilanadi.",
    duelBackList:"Duellarga qaytish",
    duelEmpty:"Hali aktiv duel yo'q",
    duelEmptySub:"Do'stingizni taklif qiling va sinashib ko'ring",
    duelTitle:"Duel rejimi", duelDesc:"Do'sting bilan test natijalarini solishtir",
    duelInviteTitle:"Do'stni duelga chaqir",
    duelInviteDesc:"Do'stingiz havolani bosgach, 24 soat ichida ikkalangiz ham 20 ta test ishlaysiz va natijalar solishtiriladi.",
    duelRule1:"20 ta savol", duelRule1Sub:"Ikkalangiz ham bir xil savollar",
    duelRule2:"24 soat", duelRule2Sub:"Havolani qabul qilgandan keyin",
    duelRule3:"Ball tizimi", duelRule3Sub:"Har bir to'g'ri javob = 5 ball",
    duelSend:"Telegram orqali taklif qilish",
    duelOpponent:"Do'st",
    discountLabel:"Maxsus taklif", discountEnds:"Bugun tugaydi!", discountBadge:"CHEGIRMA",
    refNextReward:"ta taklif qilsangiz", refRewardGet:"olasiz",
    refMilestoneLabel:"ta do'st →", refMilestoneDays:"kunlik Pro obuna sovg'a",
    refClaimed:"Olindi", refRemaining:"ta qoldi",
    refChooseBtn:"Tanlash", refRequestPending:"So'rov yuborildi, tasdiqlanishi kutilmoqda", refRequestSent:"So'rovingiz adminga yuborildi!",
    editProfile:"Profilni tahrirlash", save:"Saqlash",
    proGetBtn:"PRO olish",
    testLimitMsg:"100 ta bepul test tugadi", testLimitSub:"Davom etish uchun PRO oling",
    examLimitMsg:"2 ta urinish tugadi", examLimitSub:"Davom etish uchun PRO oling",
    tgSupport:"Telegram Support", tgChannel:"Telegram Kanal",
    actBilet:"Bilet", actTest:"Test", actExam:"Imtihon",
    duelMe:"Sen",
    // ── ADMIN PANEL ──
    adminPanel:"Admin panel", adminDashboard:"Boshqaruv paneli",
    adminTickets:"Biletlar", adminTopics:"Mavzular", adminRules:"Yo'l qoidalari",
    adminNotifs:"Bildirishnomalar", adminPro:"Pro va chegirmalar", adminAdmins:"Adminlar",
    adminTotalUsers:"Foydalanuvchilar", adminTotalTickets:"Biletlar", adminProUsers:"Pro foydalanuvchilar", adminTotalTopics:"Mavzular",
    adminAddTicket:"Bilet qo'shish", adminTicketNumber:"Bilet raqami", adminQuestionCount:"Savollar soni",
    adminFreeTicket:"Bepul bilet", adminProTicket:"Pro bilet",
    adminAddTopic:"Mavzu qo'shish", adminTopicName:"Mavzu nomi (uz/ru/kril)", adminTopicCount:"Savollar soni", adminTopicColor:"Rang",
    adminAddRuleCategory:"Toifa qo'shish", adminAddRuleItem:"Belgi qo'shish", adminRuleCategoryName:"Toifa nomi", adminRuleDesc:"Tavsif (ixtiyoriy)",
    adminSendNotif:"Bildirishnoma yuborish", adminNotifTitle:"Sarlavha", adminNotifBody:"Matn (uz/ru/kril)",
    adminNotifType:"Turi", adminSendBtn:"Yuborish", adminSentHistory:"Yuborilganlar tarixi",
    adminDiscountActive:"Chegirma faol", adminDiscountPercent:"Chegirma foizi", adminDiscountEnd:"Tugash sanasi",
    adminPricesTitle:"Pro narxlari (so'm)",
    adminLimitsTitle:"Limitlar", adminFreeExamLimit:"Kunlik bepul imtihon", adminFreeTestLimit:"Kunlik bepul test", adminFreeTicketLimit:"Bepul biletlar soni",
    adminRefMilestones:"Referal darajalari", adminRefCount:"Do'stlar soni", adminRefDays:"Pro kunlari",
    adminAddAdmin:"Admin qo'shish", adminAdminName:"Ism", adminAdminTgId:"Telegram ID", adminAdminRole:"Roli",
    adminEditAdmin:"Tahrirlash",
    adminRolePresetHint:"Roli tanlanganda standart ruxsatlar avtomatik belgilanadi, lekin pastda har birini alohida o'zgartirishingiz mumkin",
    adminPermissions:"Huquqlar", adminSave:"Saqlash", adminCancel:"Bekor qilish", adminDelete:"O'chirish",
    adminAddBtn:"Qo'shish", adminNoAccess:"Sizda admin huquqi yo'q",
    adminAll:"Barchasi", adminQuestionPoolNote:"Imtihon, Test va Duel savollari avtomatik ravishda Biletlardan tasodifiy tanlanadi: bepul foydalanuvchilar faqat bepul biletlar savollarini, Pro foydalanuvchilar barcha biletlar savollarini oladi.",
    adminChanges:"O'zgarishlar",
    adminChangeSubmitted:"Yuborildi! Super admin tasdiqlashini kutmoqda.",
    adminChangesQueueNote:"Boshqa adminlar tomonidan yuborilgan o'zgarishlar shu yerda ko'rinadi. Tasdiqlamaguningizcha ular asosiy ma'lumotlarga ta'sir qilmaydi.",
    adminMyChangesNote:"Sizning o'zgarishlaringiz super admin tomonidan ko'rib chiqilgunicha kutadi. Tasdiqlangach, ular ilovada ko'rinadi.",
    adminNoChanges:"O'zgarishlar yo'q",
    adminChangeBy:"Yuborgan:",
    adminEditChange:"Tahrirlash",
    adminRestoreChange:"Qaytarish (qaytadan ko'rib chiqish)",
    changeAddTicket:"Yangi bilet qo'shish",
    changeDeleteTicket:"Biletni o'chirish",
    changeToggleTicketPro:"Bilet holatini o'zgartirish",
    changeEditQuestions:"Bilet savollarini tahrirlash",
    changeAddTopic:"Yangi mavzu qo'shish",
    changeDeleteTopic:"Mavzuni o'chirish",
    changeAddRuleCategory:"Yangi toifa qo'shish",
    changeAddRuleItem:"Yangi belgi qo'shish",
    changeDeleteRuleItem:"Belgini o'chirish",
    adminEditTicket:"Bilet sozlamalari", adminTicketStatus:"Holati",
    adminConfirmDelete:"Rostdan ham o'chirilsinmi?",
    adminSuccess:"Muvaffaqiyatli saqlandi", adminDeleted:"O'chirildi",
    adminEditQuestions:"Savollarni tahrirlash", adminQuestionEditor:"Savol muharriri",
    adminQuestionText:"Savol matni", adminOptionsLabel:"Javob variantlari (to'g'risini belgilang)",
    adminOptionPlaceholder:"Variant", adminCorrectHint:"To'g'ri javobni belgilash uchun harfni bosing",
    adminExplanationLabel:"Izoh (to'g'ri javob tushuntirishi)",
    adminAddQuestion:"Savol qo'shish", adminRemoveQuestion:"Savolni o'chirish",
    adminQuestionImage:"Savol rasmi (ixtiyoriy)", adminUploadImage:"Rasm yuklash",
    adminQuestionTopic:"Mavzu", adminNoTopic:"Mavzu tanlanmagan",
    adminProRequests:"Pro obuna so'rovlari", adminProRequestPlan:"Tarif", adminProRequestAmount:"Summa",
    adminProRequestReceipt:"Chek", adminApprove:"Tasdiqlash", adminReject:"Rad etish",
    adminStatusPending:"Kutilmoqda", adminStatusApproved:"Tasdiqlandi", adminStatusRejected:"Rad etildi",
    adminNoRequests:"So'rovlar yo'q",
    adminRefGrants:"Referal orqali Pro berish", adminRefGrantBtn:"Pro berish",
    proRejectedMsg:"To'lovingiz tasdiqlanmadi. Iltimos qaytadan urinib ko'ring yoki qo'llab-quvvatlash bilan bog'laning.",
  },
  ru: {
    code:"ru", label:"Русский", flag:"🇷🇺",
    login:"Войти", register:"Регистрация", phone:"Номер телефона", password:"Пароль",
    confirmPass:"Подтвердите пароль", forgotPass:"Забыли пароль?",
    orWith:"или", googleLogin:"Войти через Google",
    noAccount:"Нет аккаунта?", haveAccount:"Уже есть аккаунт?",
    name:"Имя", surname:"Фамилия", createAccount:"Создайте аккаунт и начните обучение",
    hello:"Здравствуйте,", home:"Главная", todayResult:"Сегодняшний результат", allBtn:"Все →",
    active:"Активность", tests:"Тесты", rating:"Рейтинг",
    tickets:"Билеты", ticketsSub:"100 билетов", testsSub:"Без ограничений",
    exam:"Экзамен", examSub:"Официальный тест", stats:"Статистика", statsSub:"Ваши результаты",
    ratingSub:"Топ результаты", profile:"Профиль", profileSub:"Настройки",
    todayGoal:"Цель на сегодня", lastActivity:"Последняя активность",
    allTickets:"100 билетов доступно", bookmarked:"Сохранённые",
    allTab:"Все", done:"Завершённые", undone:"Незавершённые",
    questions:"вопросов", questionOf:"Вопрос",
    back:"Назад", next:"Далее", finish:"Завершить", explanation:"Пояснение", explanationTitle:"Пояснение к правильному ответу", noExplanation:"Пояснение не добавлено.",
    greatResult:"Отличный результат!", failed:"Не сдано",
    ticketDone:"завершён", otherTicket:"Выбрать другой билет", goHome:"На главную",
    infiniteTest:"Бесконечный тест", infiniteSub:"Все вопросы в случайном порядке", startTest:"Начать тест",
    currentSeries:"Текущая серия", bestSeries:"Лучшая серия", rightAnswer:"правильных",
    lastResults:"Последние результаты", byTopic:"По темам", hardQ:"Сложные вопросы",
    examTitle:"Экзамен", examReady:"Подготовка к официальному экзамену",
    examRules:"Правила экзамена",
    rule1:"Даётся 20 вопросов", rule2:"1 минута на каждый вопрос",
    rule3:"Более 2 ошибок — экзамен не сдан",
    rule4:"В конце показывается результат и статистика",
    questionCount:"Вопросы", time:"Время", errorLimit:"Лимит ошибок",
    startExam:"Начать экзамен", question:"Вопрос", errors:"Ошибки",
    congrats:"Поздравляем! 🎉", examPassed:"Вы успешно сдали экзамен.",
    examFailed:"Экзамен не сдан", tooManyErrors:"ошибок зафиксировано.",
    correct:"Правильных", wrong:"Неправильных", result:"Результат",
    avgResult:"Средний результат", examCount:"Всего экзаменов",
    passedExams:"Сданных", failedExams:"Не сданных",
    retryExam:"Попробовать снова",
    statistics:"Статистика", general:"Общий", weekly:"Недельный", monthly:"Месячный", yearly:"Годовой",
    totalQ:"Всего вопросов", correctA:"Правильных ответов", wrongA:"Неправильных ответов", correctPct:"Процент правильных",
    resultsGraph:"График результатов",
    statsMistakesTitle:"Ошибки по темам",
    statsMistakesSub:"Узнайте, в какой теме вы допускаете больше ошибок",
    statsMistakePct:"ошибок",
    statsRecommendTitle:"Рекомендация",
    statsRecommendBefore:"Большая часть ваших ошибок приходится на тему",
    statsRecommendAfter:"({pct}%). Уделите больше внимания этой теме!",
    statsPracticeBtn:"Практиковаться",
    ratingTitle:"Рейтинг", daily:"Ежедневный",
    ratingEmpty:"Пока нет результатов",
    loading:"Загрузка...",
    certs:"Мои сертификаты", settings:"Настройки", lang:"Язык", about:"О нас", news:"Канал новостей", logout:"Выйти",
    pro:"Pro подписка", support:"Поддержка", share:"Поделиться",
    referral:"Реферал", referralTitle:"Пригласите друзей",
    referralSub:"Получайте награды за каждое приглашение",
    referralCode:"Ваш реферальный код",
    referralCopy:"Копировать", referralCopied:"Скопировано!",
    referralShare:"Поделиться с друзьями",
    referralStats:"Статистика", referralInvited:"Приглашено",
    referralEarned:"Полученные награды",
    referralProgress:"До следующей награды",
    referralHowTitle:"Как это работает?",
    referralStep1:"Отправьте реферальный код друзьям",
    referralStep2:"Друг регистрируется с кодом",
    referralStep3:"При достижении цели получите подарок Pro",
    referralRewards:"Уровни наград",
    referralHistory:"История приглашений",
    referralPending:"Ожидание",
    referralGifted:"Подарок вручён",
    proTitle:"Nazariy PRO", proSubtitle:"Лучшая подготовка к экзамену",
    proNoAds:"Без рекламы", proNoAdsSub:"Никакой рекламы",
    proUnlimited:"Безлимитные тесты", proUnlimitedSub:"Полный доступ ко всем билетам",
    proStats:"Подробная статистика", proStatsSub:"Узнайте свои сильные и слабые стороны",
    proMonthly:"Ежемесячная подписка", proCancel:"Отмена в любое время",
    proSubscribe:"Подписаться", proSecure:"Безопасная оплата", proChoosePay:"Выберите способ оплаты",
    proWeekly:"Недельный", proMonth1:"1 месяц", proMonth2:"2 месяца",
    proPaymentTitle:"Оплатите подписку",
    proSavingPct:"экономии",
    proPayToCard:"Переведите на карту ниже",
    proCardOwner:"ВЛАДЕЛЕЦ КАРТЫ",
    proCopyCardBtn:"Скопировать номер карты",
    proUploadReceiptTitle:"Отправьте чек об оплате",
    proUploadReceiptDesc:"После перевода загрузите скриншот или файл чека",
    proUploadFileBtn:"Загрузить файл",
    proFileTypes:"Скриншот или PDF • JPG, PNG, PDF",
    proChooseAnotherFile:"Выбрать другой файл",
    proSendReceiptBtn:"Отправить чек",
    proDataSecure:"Ваши данные защищены",
    proCheckingTitle:"Проверяется...",
    proCheckingDesc1:"Ваш чек об оплате отправлен админу.",
    proCheckingDesc2:"После подтверждения придёт уведомление.",
    proPaymentDetails:"Детали оплаты",
    proTariff:"Тариф", proStatus:"Статус",
    proUploadedReceipt:"Загруженный чек:",
    proAdminCheckDesc1:"Админ проверит платёж и уведомит вас. Обычно подтверждается в течение",
    proAdminCheckDesc2:".",
    proMinutes:"минут",
    proPopular:"Популярный", proBest:"Выгодный",
    exams:"Экзамены", passed:"Сдано", notPassed:"Не сдано",
    darkMode:"Тёмный режим", lightMode:"Светлый режим",
    notifications:"Уведомления", notifEmpty:"Нет уведомлений",
    notifAll:"Все", notifUnread:"Непрочитанные",
    markAllRead:"Отметить все прочитанными",
    notifSettings:"Настройки уведомлений",
    notifDaily:"Ежедневное напоминание", notifResult:"О результатах",
    notifNew:"Новый билет", notifExam:"Напоминание об экзамене",
    notifOn:"Включено", notifOff:"Выключено",
    justNow:"Только что", minsAgo:"мин. назад", hoursAgo:"ч. назад", daysAgo:"дн. назад", yesterday:"Вчера",
    savedQ:"Сохранённые", savedEmpty:"Нет сохранённых вопросов",
    savedSub:"Сохраняйте вопросы с помощью закладок",
    savedCount:"сохранённых вопросов", removeBookmark:"Удалить",
    practiceAll:"Практиковать все", ticket:"Билет",
    bookmarkAdded:"Вопрос сохранён!", bookmarkRemoved:"Вопрос удалён",
    skip:"Пропустить", getStarted:"Начать", continue:"Продолжить",
    ob1Title:"Учитесь с Nazariy!",        ob1Sub:"Готовьтесь к экзамену по вождению с 100 билетами и тысячами вопросов.",
    ob2Title:"Билеты и тесты",             ob2Sub:"20 вопросов в каждом билете. Режим бесконечного теста для тренировки.",
    ob3Title:"Режим экзамена",             ob3Sub:"Тренируйтесь в условиях официального экзамена. Следите за лимитом ошибок.",
    ob4Title:"Результаты и рейтинг",       ob4Sub:"Отслеживайте свои результаты и найдите своё место в таблице лидеров!",
    search:"Поиск", searchPlaceholder:"Билет, вопрос или тема...",
    searchResults:"Результаты", noResults:"Ничего не найдено",
    filterAll:"Все", filterTickets:"Билеты", filterQuestions:"Вопросы",
    searchHint:"Введите номер билета или ключевое слово",
    topics:"Темы", topicsSub:"Учёба по разделам",
    rules:"ПДД", rulesSub:"Правила дорожного движения",
    rulesSections:"раздела", rulesSigns:"знаков",
    topicsTitle:"Темы для изучения",
    rulesTitle:"Правила дорожного движения",
    duel:"Дуэль", duelSub:"Соревнуйся с другом",
    duelActive:"Активные дуэли", duelHistory:"История",
    duelInvite:"Пригласить друга на дуэль",
    duelWaiting:"Друг ещё не прошёл тест",
    duelYourTurn:"Ваша очередь",
    duelStart:"Начать тест",
    duelWin:"Победа", duelLoss:"Поражение",
    duelTie:"Ничья",
    duelSubmitted:"Ваши ответы отправлены!",
    duelYou:"Вы",
    duelWaitingForOpponent:"Ожидание соперника",
    duelWaitingOpponentResult:"Ваш соперник пока не ответил. Результат обновится, когда он закончит.",
    duelBackList:"Назад к дуэлям",
    duelEmpty:"Нет активных дуэлей",
    duelEmptySub:"Пригласите друга и сразитесь",
    duelTitle:"Режим дуэли", duelDesc:"Сравни результаты теста с другом",
    duelInviteTitle:"Пригласить друга на дуэль",
    duelInviteDesc:"После принятия ссылки у вас обоих есть 24 часа пройти 20 вопросов и сравнить результаты.",
    duelRule1:"20 вопросов", duelRule1Sub:"Одинаковые вопросы для обоих",
    duelRule2:"24 часа", duelRule2Sub:"После принятия приглашения",
    duelRule3:"Система очков", duelRule3Sub:"Каждый правильный ответ = 5 очков",
    duelSend:"Пригласить через Telegram",
    duelOpponent:"Друг",
    discountLabel:"Спецпредложение", discountEnds:"Сегодня истекает!", discountBadge:"СКИДКА",
    refNextReward:"приглашений и получите", refRewardGet:"",
    refMilestoneLabel:"друзей →", refMilestoneDays:"дней Pro в подарок",
    refClaimed:"Получено", refRemaining:"осталось",
    refChooseBtn:"Выбрать", refRequestPending:"Запрос отправлен, ожидает подтверждения", refRequestSent:"Ваш запрос отправлен админу!",
    editProfile:"Редактировать профиль", save:"Сохранить",
    proGetBtn:"Получить PRO",
    testLimitMsg:"100 бесплатных тестов исчерпаны", testLimitSub:"Получите PRO, чтобы продолжить",
    examLimitMsg:"2 попытки использованы", examLimitSub:"Получите PRO, чтобы продолжить",
    tgSupport:"Telegram Support", tgChannel:"Telegram Канал",
    actBilet:"Билет", actTest:"Тест", actExam:"Экзамен",
    duelMe:"Вы",
    // ── ADMIN PANEL ──
    adminPanel:"Админ панель", adminDashboard:"Панель управления",
    adminTickets:"Билеты", adminTopics:"Темы", adminRules:"ПДД",
    adminNotifs:"Уведомления", adminPro:"Pro и скидки", adminAdmins:"Админы",
    adminTotalUsers:"Пользователи", adminTotalTickets:"Билеты", adminProUsers:"Pro пользователи", adminTotalTopics:"Темы",
    adminAddTicket:"Добавить билет", adminTicketNumber:"Номер билета", adminQuestionCount:"Кол-во вопросов",
    adminFreeTicket:"Бесплатный билет", adminProTicket:"Pro билет",
    adminAddTopic:"Добавить тему", adminTopicName:"Название темы (uz/ru/kril)", adminTopicCount:"Кол-во вопросов", adminTopicColor:"Цвет",
    adminAddRuleCategory:"Добавить категорию", adminAddRuleItem:"Добавить знак", adminRuleCategoryName:"Название категории", adminRuleDesc:"Описание (необязательно)",
    adminSendNotif:"Отправить уведомление", adminNotifTitle:"Заголовок", adminNotifBody:"Текст (uz/ru/kril)",
    adminNotifType:"Тип", adminSendBtn:"Отправить", adminSentHistory:"История отправок",
    adminDiscountActive:"Скидка активна", adminDiscountPercent:"Процент скидки", adminDiscountEnd:"Дата окончания",
    adminPricesTitle:"Цены Pro (сум)",
    adminLimitsTitle:"Лимиты", adminFreeExamLimit:"Бесплатных экзаменов в день", adminFreeTestLimit:"Бесплатных тестов в день", adminFreeTicketLimit:"Кол-во бесплатных билетов",
    adminRefMilestones:"Уровни рефералов", adminRefCount:"Кол-во друзей", adminRefDays:"Дней Pro",
    adminAddAdmin:"Добавить админа", adminAdminName:"Имя", adminAdminTgId:"Telegram ID", adminAdminRole:"Роль",
    adminEditAdmin:"Редактировать",
    adminRolePresetHint:"При выборе роли права устанавливаются автоматически, но вы можете изменить каждое ниже",
    adminPermissions:"Права", adminSave:"Сохранить", adminCancel:"Отмена", adminDelete:"Удалить",
    adminAddBtn:"Добавить", adminNoAccess:"У вас нет прав администратора",
    adminAll:"Все", adminQuestionPoolNote:"Вопросы для Экзамена, Теста и Дуэли автоматически выбираются случайно из Билетов: бесплатные пользователи получают только вопросы бесплатных билетов, Pro — из всех билетов.",
    adminChanges:"Изменения",
    adminChangeSubmitted:"Отправлено! Ожидает подтверждения супер админа.",
    adminChangesQueueNote:"Здесь отображаются изменения, отправленные другими админами. До подтверждения они не влияют на основные данные.",
    adminMyChangesNote:"Ваши изменения ожидают проверки супер админа. После подтверждения они появятся в приложении.",
    adminNoChanges:"Изменений нет",
    adminChangeBy:"Отправил:",
    adminEditChange:"Редактировать",
    adminRestoreChange:"Восстановить (рассмотреть снова)",
    changeAddTicket:"Добавление нового билета",
    changeDeleteTicket:"Удаление билета",
    changeToggleTicketPro:"Изменение статуса билета",
    changeEditQuestions:"Редактирование вопросов билета",
    changeAddTopic:"Добавление новой темы",
    changeDeleteTopic:"Удаление темы",
    changeAddRuleCategory:"Добавление новой категории",
    changeAddRuleItem:"Добавление нового знака",
    changeDeleteRuleItem:"Удаление знака",
    adminEditTicket:"Настройки билета", adminTicketStatus:"Статус",
    adminConfirmDelete:"Точно удалить?",
    adminSuccess:"Успешно сохранено", adminDeleted:"Удалено",
    adminEditQuestions:"Редактировать вопросы", adminQuestionEditor:"Редактор вопроса",
    adminQuestionText:"Текст вопроса", adminOptionsLabel:"Варианты ответа (отметьте правильный)",
    adminOptionPlaceholder:"Вариант", adminCorrectHint:"Нажмите на букву, чтобы отметить правильный ответ",
    adminExplanationLabel:"Пояснение (объяснение правильного ответа)",
    adminAddQuestion:"Добавить вопрос", adminRemoveQuestion:"Удалить вопрос",
    adminQuestionImage:"Изображение вопроса (необязательно)", adminUploadImage:"Загрузить изображение",
    adminQuestionTopic:"Тема", adminNoTopic:"Тема не выбрана",
    adminProRequests:"Запросы на Pro подписку", adminProRequestPlan:"Тариф", adminProRequestAmount:"Сумма",
    adminProRequestReceipt:"Чек", adminApprove:"Подтвердить", adminReject:"Отклонить",
    adminStatusPending:"Ожидание", adminStatusApproved:"Подтверждено", adminStatusRejected:"Отклонено",
    adminNoRequests:"Нет запросов",
    adminRefGrants:"Выдача Pro по рефералам", adminRefGrantBtn:"Выдать Pro",
    proRejectedMsg:"Ваш платёж не подтверждён. Попробуйте снова или обратитесь в поддержку.",
  },
  kril: {
    code:"kril", label:"Ўзбекча", flag:"🇺🇿",
    login:"Кириш", register:"Рўйхатдан ўтиш", phone:"Телефон рақам", password:"Парол",
    confirmPass:"Паролни тасдиқланг", forgotPass:"Паролни унутдингизми?",
    orWith:"ёки", googleLogin:"Google орқали кириш",
    noAccount:"Ҳисобингиз йўқми?", haveAccount:"Ҳисобингиз борми?",
    name:"Исм", surname:"Фамилия", createAccount:"Ҳисоб яратинг ва ўрганишни бошланг",
    hello:"Ассалому алайкум,", home:"Бош саҳифа", todayResult:"Бугунги натижа", allBtn:"Барчаси →",
    active:"Фаоллар", tests:"Тестлар", rating:"Рейтинг",
    tickets:"Билетлар", ticketsSub:"100 та билет", testsSub:"Чексиз савол",
    exam:"Имтиҳон", examSub:"Расмий тест", stats:"Статистика", statsSub:"Натижаларингиз",
    ratingSub:"Топ Натижалар", profile:"Профил", profileSub:"Созламалар",
    todayGoal:"Бугунги мақсад", lastActivity:"Охирги фаолият",
    allTickets:"100 та билет мавжуд", bookmarked:"Сақланган",
    allTab:"Барчаси", done:"Якунланган", undone:"Якунланмаган",
    questions:"та савол", questionOf:"Савол",
    back:"Орқага", next:"Кейинги", finish:"Тугатиш", explanation:"Изоҳ", explanationTitle:"Тўғри жавоб изоҳи", noExplanation:"Бу савол учун изоҳ қўшилмаган.",
    greatResult:"Зўр натижа!", failed:"Муваффақиятсиз",
    ticketDone:"якунланди", otherTicket:"Бошқа билет танлаш", goHome:"Бош саҳифага қайтиш",
    infiniteTest:"Чексиз тест", infiniteSub:"Барча саволлар аралаш ҳолда келади", startTest:"Тестни бошлаш",
    currentSeries:"Жорий серия", bestSeries:"Энг яхши серия", rightAnswer:"тўғри жавоб",
    lastResults:"Сўнгги натижалар", byTopic:"Мавзулар бўйича", hardQ:"Қийин саволлар",
    examTitle:"Имтиҳон", examReady:"Расмий имтиҳонга тайёрлик",
    examRules:"Имтиҳон қоидалари",
    rule1:"20 та савол берилади", rule2:"Ҳар бир саволга 1 дақиқа",
    rule3:"2 тадан ортиқ хато бўлса имтиҳондан ўта олмайсиз",
    rule4:"Имтиҳон якунида натижа ва статистика кўрсатилади",
    questionCount:"Саволлар", time:"Вақт", errorLimit:"Хато лимит",
    startExam:"Имтиҳонни бошлаш", question:"Савол", errors:"Хатолар",
    congrats:"Табрикlaймиз! 🎉", examPassed:"Имтиҳондан муваффақиятли ўтдингиз.",
    examFailed:"Имтиҳондан ўта олмадингиз", tooManyErrors:"тадан ортиқ хато қайд этилди.",
    correct:"Тўғри жавоб", wrong:"Нотўғри жавоб", result:"Натижа",
    avgResult:"Ўртача натижа", examCount:"Имтиҳонлар сони",
    passedExams:"Ўтган имтиҳонлар", failedExams:"Ўтмаган имтиҳонлар",
    retryExam:"Қайта уриниш",
    statistics:"Статистика", general:"Умумий", weekly:"Ҳафталик", monthly:"Ойлик", yearly:"Йиллик",
    totalQ:"Жами саволлар", correctA:"Тўғри жавоблар", wrongA:"Нотўғри жавоблар", correctPct:"Тўғри фоизи",
    resultsGraph:"Натижалар графиги",
    statsMistakesTitle:"Мавзулар бўйича хатолар",
    statsMistakesSub:"Қайси мавзуда кўпроқ хато қилаётганингизни кўринг",
    statsMistakePct:"хато",
    statsRecommendTitle:"Тавсия",
    statsRecommendBefore:"Хатоларингизнинг катта қисми",
    statsRecommendAfter:"мавзусига тўғри келмоқда ({pct}%). Шу мавзу бўйича кўпроқ машқ қилинг!",
    statsPracticeBtn:"Машқ қилиш",
    ratingTitle:"Рейтинг", daily:"Кунлик",
    ratingEmpty:"Ҳали натижалар йўқ",
    loading:"Юкланмоқда...",
    certs:"Сертификатларим", settings:"Созламалар", lang:"Тил", about:"Биз ҳақимизда", news:"Янгиликлар", logout:"Чиқиш",
    pro:"Pro обуна", support:"Қўллаб-қувватлаш", share:"Улашиш",
    referral:"Реферал", referralTitle:"Дўстларни таклиф қилинг",
    referralSub:"Ҳар бир таклиф учун мукофот олинг",
    referralCode:"Сизнинг реферал кодингиз",
    referralCopy:"Нусхалаш", referralCopied:"Нусхаланди!",
    referralShare:"Дўстларга улашиш",
    referralStats:"Статистика", referralInvited:"Таклиф қилинган",
    referralEarned:"Қўлга киритилган мукофотлар",
    referralProgress:"Кейинги мукофотга",
    referralHowTitle:"Қандай ишлайди?",
    referralStep1:"Реферал кодингизни дўстларга юборинг",
    referralStep2:"Дўстингиз код билан рўйхатдан ўтади",
    referralStep3:"Чегара тўлганда Pro совға оласиз",
    referralRewards:"Мукофот даражалари",
    referralHistory:"Таклиф тарихи",
    referralPending:"Кутилмоқда",
    referralGifted:"Совға берилди",
    proTitle:"Nazariy PRO", proSubtitle:"Имтиҳонга энг яхши тайёргарлик кўринг",
    proNoAds:"Реклама йўқ", proNoAdsSub:"Ҳеч қандай реклама кўрмайсиз",
    proUnlimited:"Чексиз тестлар", proUnlimitedSub:"Барча билет ва тестларга тўлиқ кириш",
    proStats:"Батафсил статистика", proStatsSub:"Кучли ва заиф томонларингизни билинг",
    proMonthly:"Ойлик обуна", proCancel:"Истаган вақт бекор қилиш мумкин",
    proSubscribe:"Обуна бўлиш", proSecure:"Тўлов хавфсиз ва ҳимояланган", proChoosePay:"Тўлов усулини танланг",
    proWeekly:"Ҳафталик", proMonth1:"1 ойлик", proMonth2:"2 ойлик",
    proPaymentTitle:"Тўловни амалга оширинг",
    proSavingPct:"тежайдингиз",
    proPayToCard:"Қуйидаги картага ўтказинг",
    proCardOwner:"КАРТА ЭГАСИ",
    proCopyCardBtn:"Карта рақамини нусхалаш",
    proUploadReceiptTitle:"Тўлов чекини юборинг",
    proUploadReceiptDesc:"Пул ўтказгандан сўнг screenshot ёки чек файлини юкланг",
    proUploadFileBtn:"Файл юклаш",
    proFileTypes:"Screenshot ёки PDF • JPG, PNG, PDF",
    proChooseAnotherFile:"Бошқа файл танлаш",
    proSendReceiptBtn:"Чекни юбориш",
    proDataSecure:"Маълумотларингиз хавфсиз",
    proCheckingTitle:"Текширилмоқда...",
    proCheckingDesc1:"Тўлов чекингиз админга юборилди.",
    proCheckingDesc2:"Тасдиқлангач билдиришнома келади.",
    proPaymentDetails:"Тўлов тафсилотлари",
    proTariff:"Тариф", proStatus:"Ҳолат",
    proUploadedReceipt:"Юкланган чек:",
    proAdminCheckDesc1:"Админ тўловни текшириб, билдиришнома орқали хабардор қилади. Одатда",
    proAdminCheckDesc2:"ичида тасдиқланади.",
    proMinutes:"дақиқа",
    proPopular:"Машҳур", proBest:"Тежамли",
    exams:"Имтиҳонлар", passed:"Ўтган", notPassed:"Ўтмаган",
    darkMode:"Тунги режим", lightMode:"Кундузги режим",
    notifications:"Билдиришномалар", notifEmpty:"Билдиришномалар йўқ",
    notifAll:"Барчаси", notifUnread:"Ўқилмаган",
    markAllRead:"Барчасини ўқилган деб белгилаш",
    notifSettings:"Билдиришнома созламалари",
    notifDaily:"Кунлик эслатма", notifResult:"Натижа ҳақида",
    notifNew:"Янги билет", notifExam:"Имтиҳон эслатмаси",
    notifOn:"Ёқилган", notifOff:"Ўчирилган",
    justNow:"Ҳозир", minsAgo:"дақиқа олдин", hoursAgo:"соат олдин", daysAgo:"кун олдин", yesterday:"Кеча",
    savedQ:"Сақланганлар", savedEmpty:"Ҳали сақланган савол йўқ",
    savedSub:"Саволларни bookmark қилиб сақланг",
    savedCount:"та сақланган савол", removeBookmark:"Олиб ташлаш",
    practiceAll:"Ҳамасини машқ қилиш", ticket:"Билет",
    bookmarkAdded:"Савол сақланди!", bookmarkRemoved:"Савол ўчирилди",
    skip:"Ўтказиб юбориш", getStarted:"Бошлаш", continue:"Давом этиш",
    ob1Title:"Назарий билан ўрганинг!",   ob1Sub:"100 та билет ва минглаб саволлар орқали ҳайдовчилик имтиҳонига тайёрланинг.",
    ob2Title:"Билет ва тестлар",           ob2Sub:"Ҳар бир билетда 20 та савол. Чексиз тест режими билан билимингизни синаб кўринг.",
    ob3Title:"Имтиҳон режими",             ob3Sub:"Расмий имтиҳон шароитида машқ қилинг. Хато лимитига риоя қилиб, натижангизни оширинг.",
    ob4Title:"Натижа ва рейтинг",          ob4Sub:"Ўз натижангизни кузатинг, рейтинг жадвалида ўз ўрнингизни топинг!",
    search:"Қидириш", searchPlaceholder:"Билет, савол ёки мавзу...",
    searchResults:"Натижалар", noResults:"Ҳеч нарса топилмади",
    filterAll:"Барчаси", filterTickets:"Билетлар", filterQuestions:"Саволлар",
    searchHint:"Билет рақами ёки калит сўз киритинг",
    topics:"Мавзулар", topicsSub:"Бўлимлар бўйича ўрганиш",
    rules:"Йўл Қоидалари", rulesSub:"ЙҲҚ қоидалари",
    rulesSections:"бўлим", rulesSigns:"та белги",
    topicsTitle:"Мавзулар бўйича ўрганиш",
    rulesTitle:"Йўл Ҳаракати Қоидалари",
    duel:"Дуэль", duelSub:"Дўстинг билан беллаш",
    duelActive:"Фаол дуэллар", duelHistory:"Тарих",
    duelInvite:"Дўстни дуэлга таклиф қилиш",
    duelWaiting:"Дўстингиз ҳали тестни ишламади",
    duelYourTurn:"Сизнинг навбатингиз",
    duelStart:"Тестни бошлаш",
    duelWin:"Ғалаба", duelLoss:"Мағлубият",
    duelTie:"Дуранг",
    duelSubmitted:"Жавобларингиз юборилди!",
    duelYou:"Сиз",
    duelWaitingForOpponent:"Рақиб кутилмоқда",
    duelWaitingOpponentResult:"Рақибингиз ҳали жавоб бермади. Натижа у тугатгач янгиланади.",
    duelBackList:"Дуэлларга қайтиш",
    duelEmpty:"Ҳали актив дуэль йўқ",
    duelEmptySub:"Дўстингизни таклиф қилинг ва синашиб кўринг",
    duelTitle:"Дуэль режими", duelDesc:"Дўстинг билан тест натижаларини солиштир",
    duelInviteTitle:"Дўстни дуэлга чақириш",
    duelInviteDesc:"Дўстингиз ҳаволани босгач, 24 соат ичида иккалангиз ҳам 20 та тест ишлайсиз ва натижалар солиштирилади.",
    duelRule1:"20 та савол", duelRule1Sub:"Иккалангиз ҳам бир хил саволлар",
    duelRule2:"24 соат", duelRule2Sub:"Ҳаволани қабул қилгандан кейин",
    duelRule3:"Балл тизими", duelRule3Sub:"Ҳар бир тўғри жавоб = 5 балл",
    duelSend:"Telegram орқали таклиф қилиш",
    duelOpponent:"Дўст",
    discountLabel:"Махсус таклиф", discountEnds:"Бугун тугайди!", discountBadge:"ЧЕГИРМА",
    refNextReward:"та таклиф қилсангиз", refRewardGet:"оласиз",
    refMilestoneLabel:"та дўст →", refMilestoneDays:"кунлик Pro обуна совға",
    refClaimed:"Олинди", refRemaining:"та қолди",
    refChooseBtn:"Танлаш", refRequestPending:"Сўров юборилди, тасдиқланиши кутилмоқда", refRequestSent:"Сўровингиз админга юборилди!",
    editProfile:"Профилни таҳрирлаш", save:"Сақлаш",
    proGetBtn:"PRO олиш",
    testLimitMsg:"100 та бепул тест тугади", testLimitSub:"Давом этиш учун PRO олинг",
    examLimitMsg:"2 та уриниш тугади", examLimitSub:"Давом этиш учун PRO олинг",
    tgSupport:"Telegram Support", tgChannel:"Telegram Канал",
    actBilet:"Билет", actTest:"Тест", actExam:"Имтиҳон",
    duelMe:"Сиз",
    // ── ADMIN PANEL ──
    adminPanel:"Админ панел", adminDashboard:"Бошқарув панели",
    adminTickets:"Билетлар", adminTopics:"Мавзулар", adminRules:"Йўл қоидалари",
    adminNotifs:"Билдиришномалар", adminPro:"Pro ва чегирмалар", adminAdmins:"Админлар",
    adminTotalUsers:"Фойдаланувчилар", adminTotalTickets:"Билетлар", adminProUsers:"Pro фойдаланувчилар", adminTotalTopics:"Мавзулар",
    adminAddTicket:"Билет қўшиш", adminTicketNumber:"Билет рақами", adminQuestionCount:"Саволлар сони",
    adminFreeTicket:"Бепул билет", adminProTicket:"Pro билет",
    adminAddTopic:"Мавзу қўшиш", adminTopicName:"Мавзу номи (uz/ru/kril)", adminTopicCount:"Саволлар сони", adminTopicColor:"Ранг",
    adminAddRuleCategory:"Тоифа қўшиш", adminAddRuleItem:"Белги қўшиш", adminRuleCategoryName:"Тоифа номи", adminRuleDesc:"Тавсиф (ихтиёрий)",
    adminSendNotif:"Билдиришнома юбориш", adminNotifTitle:"Сарлавҳа", adminNotifBody:"Матн (uz/ru/kril)",
    adminNotifType:"Тури", adminSendBtn:"Юбориш", adminSentHistory:"Юборилганлар тарихи",
    adminDiscountActive:"Чегирма фаол", adminDiscountPercent:"Чегирма фоизи", adminDiscountEnd:"Тугаш санаси",
    adminPricesTitle:"Pro нархлари (сум)",
    adminLimitsTitle:"Лимитлар", adminFreeExamLimit:"Кунлик бепул имтиҳон", adminFreeTestLimit:"Кунлик бепул тест", adminFreeTicketLimit:"Бепул билетлар сони",
    adminRefMilestones:"Реферал даражалари", adminRefCount:"Дўстлар сони", adminRefDays:"Pro кунлари",
    adminAddAdmin:"Админ қўшиш", adminAdminName:"Исм", adminAdminTgId:"Telegram ID", adminAdminRole:"Роли",
    adminEditAdmin:"Таҳрирлаш",
    adminRolePresetHint:"Роли танланганда стандарт рухсатлар автоматик белгиланади, лекин пастда ҳар бирини алоҳида ўзгартиришингиз мумкин",
    adminPermissions:"Ҳуқуқлар", adminSave:"Сақлаш", adminCancel:"Бекор қилиш", adminDelete:"Ўчириш",
    adminAddBtn:"Қўшиш", adminNoAccess:"Сизда админ ҳуқуқи йўқ",
    adminAll:"Барчаси", adminQuestionPoolNote:"Имтиҳон, Тест ва Дуэль саволлари автоматик равишда Билетлардан тасодифий танланади: бепул фойдаланувчилар фақат бепул билетлар саволларини, Pro фойдаланувчилар барча билетлар саволларини олади.",
    adminChanges:"Ўзгаришлар",
    adminChangeSubmitted:"Юборилди! Супер админ тасдиқлашини кутмоқда.",
    adminChangesQueueNote:"Бошқа админлар томонидан юборилган ўзгаришлар шу ерда кўринади. Тасдиқламагунингизча улар асосий маълумотларга таъсир қилмайди.",
    adminMyChangesNote:"Сизнинг ўзгаришларингиз супер админ томонидан кўриб чиқилгунича кутади. Тасдиқлангач, улар иловада кўринади.",
    adminNoChanges:"Ўзгаришлар йўқ",
    adminChangeBy:"Юборган:",
    adminEditChange:"Таҳрирлаш",
    adminRestoreChange:"Қайтариш (қайтадан кўриб чиқиш)",
    changeAddTicket:"Янги билет қўшиш",
    changeDeleteTicket:"Билетни ўчириш",
    changeToggleTicketPro:"Билет ҳолатини ўзгартириш",
    changeEditQuestions:"Билет саволларини таҳрирлаш",
    changeAddTopic:"Янги мавзу қўшиш",
    changeDeleteTopic:"Мавзуни ўчириш",
    changeAddRuleCategory:"Янги тоифа қўшиш",
    changeAddRuleItem:"Янги белги қўшиш",
    changeDeleteRuleItem:"Белгини ўчириш",
    adminEditTicket:"Билет созламалари", adminTicketStatus:"Ҳолати",
    adminConfirmDelete:"Ростдан ҳам ўчирилсинми?",
    adminSuccess:"Муваффақиятли сақланди", adminDeleted:"Ўчирилди",
    adminEditQuestions:"Саволларни таҳрирлаш", adminQuestionEditor:"Савол муҳаррири",
    adminQuestionText:"Савол матни", adminOptionsLabel:"Жавоб вариантлари (тўғрисини белгиланг)",
    adminOptionPlaceholder:"Вариант", adminCorrectHint:"Тўғри жавобни белгилаш учун ҳарфни босинг",
    adminExplanationLabel:"Изоҳ (тўғри жавоб тушунтириши)",
    adminAddQuestion:"Савол қўшиш", adminRemoveQuestion:"Саволни ўчириш",
    adminQuestionImage:"Савол расми (ихтиёрий)", adminUploadImage:"Расм юклаш",
    adminQuestionTopic:"Мавзу", adminNoTopic:"Мавзу танланмаган",
    adminProRequests:"Pro обуна сўровлари", adminProRequestPlan:"Тариф", adminProRequestAmount:"Сумма",
    adminProRequestReceipt:"Чек", adminApprove:"Тасдиқлаш", adminReject:"Рад этиш",
    adminStatusPending:"Кутилмоқда", adminStatusApproved:"Тасдиқланди", adminStatusRejected:"Рад этилди",
    adminNoRequests:"Сўровлар йўқ",
    adminRefGrants:"Реферал орқали Pro бериш", adminRefGrantBtn:"Pro бериш",
    proRejectedMsg:"Тўловингиз тасдиқланмади. Илтимос қайтадан уриниб кўринг ёки қўллаб-қувватлаш билан боғланинг.",
  }
};

// ─── THEMES ───
function getTheme(dark) {
  return dark ? {
    primary:"#3B82F6", primaryDark:"#2563EB",
    success:"#22C55E", danger:"#EF4444", warning:"#F59E0B",
    bg:"#0F172A", white:"#1E293B", card:"#1E293B", cardBorder:"#334155",
    gray100:"#1E293B", gray200:"#334155", gray300:"#475569",
    gray400:"#64748B", gray600:"#94A3B8", gray800:"#F1F5F9",
    text:"#F1F5F9", subtext:"#94A3B8", muted:"#64748B",
    navBg:"#1E293B", inputBg:"#0F172A",
    gradStart:"#1E3A5F", gradEnd:"#1E40AF",
    primary_light:"#3B82F622",
  } : {
    primary:"#1A6BFF", primaryDark:"#1250CC",
    success:"#22C55E", danger:"#EF4444", warning:"#F59E0B",
    bg:"#F0F4FF", white:"#FFFFFF", card:"#FFFFFF", cardBorder:"transparent",
    gray100:"#F8FAFC", gray200:"#E2E8F0", gray300:"#CBD5E1",
    gray400:"#94A3B8", gray600:"#64748B", gray800:"#1E293B",
    text:"#1E293B", subtext:"#64748B", muted:"#94A3B8",
    navBg:"#FFFFFF", inputBg:"#F8FAFC",
    gradStart:"#1A6BFF", gradEnd:"#3B82F6",
    primary_light:"#1A6BFF18",
  };
}

// ─── SVG ICONS ───
const IC = {
  Home: ({size=24,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/></svg>,
  Ticket: ({size=24,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1.5a1.5 1.5 0 0 0 0 3V15a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1.5a1.5 1.5 0 0 0 0-3V9Z" stroke={color} strokeWidth="2"/><path d="M9 12H15M9 9.5H15" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Clipboard: ({size=24,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="5" y="4" width="14" height="17" rx="2" stroke={color} strokeWidth="2"/><path d="M9 3h6v3H9zM9 11h6M9 15h4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Clock: ({size=24,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2"/><path d="M12 7V12L15 15" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  User: ({size=24,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Bell: ({size=24,color="white"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth="2" strokeLinecap="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Lock: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="11" rx="2" stroke={color} strokeWidth="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Phone: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Eye: ({size=18,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={color} strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2"/></svg>,
  EyeOff: ({size=18,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  BarChart: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="3" y="12" width="4" height="9" rx="1" stroke={color} strokeWidth="2"/><rect x="10" y="7" width="4" height="14" rx="1" stroke={color} strokeWidth="2"/><rect x="17" y="3" width="4" height="18" rx="1" stroke={color} strokeWidth="2"/></svg>,
  Trophy: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M8 21h8M12 17v4M7 4H4v4c0 2.2 1.8 4 4 4M17 4h3v4c0 2.2-1.8 4-4 4" stroke={color} strokeWidth="2" strokeLinecap="round"/><path d="M7 4h10v5a5 5 0 0 1-10 0V4z" stroke={color} strokeWidth="2"/></svg>,
  Star: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke={color} strokeWidth="2" strokeLinejoin="round"/></svg>,
  Flame: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" stroke={color} strokeWidth="2" strokeLinejoin="round"/></svg>,
  BookOpen: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke={color} strokeWidth="2" strokeLinejoin="round"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke={color} strokeWidth="2" strokeLinejoin="round"/></svg>,
  AlertTriangle: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={color} strokeWidth="2" strokeLinejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Award: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="6" stroke={color} strokeWidth="2"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Settings: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={color} strokeWidth="2"/></svg>,
  Globe: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/><line x1="2" y1="12" x2="22" y2="12" stroke={color} strokeWidth="2"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke={color} strokeWidth="2"/></svg>,
  Info: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/><line x1="12" y1="16" x2="12" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="8" x2="12.01" y2="8" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  LogOut: ({size=20,color="#EF4444"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={color} strokeWidth="2" strokeLinecap="round"/><polyline points="16 17 21 12 16 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="21" y1="12" x2="9" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Edit: ({size=18,color="white"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke={color} strokeWidth="2" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Bookmark: ({size=20,color="white"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  ChevronRight: ({size=16,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><polyline points="9 18 15 12 9 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  CheckCircle: ({size=24,color="#22C55E"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/><polyline points="9 12 11 14 15 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  XCircle: ({size=24,color="#EF4444"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/><line x1="15" y1="9" x2="9" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="9" y1="9" x2="15" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  TrendingUp: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17 6 23 6 23 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Medal: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="14" r="6" stroke={color} strokeWidth="2"/><path d="M9 2h6l1 5H8L9 2z" stroke={color} strokeWidth="2" strokeLinejoin="round"/><path d="M12 10v8M9 14h6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  ArrowLeft: ({size=18,color="white"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><line x1="19" y1="12" x2="5" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/><polyline points="12 19 5 12 12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  ArrowRight: ({size=18,color="white"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/><polyline points="12 5 19 12 12 19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Crown: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M2 20h20M4 20l2-10 6 5 6-5 2 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="2" stroke={color} strokeWidth="2"/></svg>,
  Headphones: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M3 18v-6a9 9 0 0 1 18 0v6" stroke={color} strokeWidth="2" strokeLinecap="round"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" stroke={color} strokeWidth="2"/></svg>,
  Share: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="18" cy="5" r="3" stroke={color} strokeWidth="2"/><circle cx="6" cy="12" r="3" stroke={color} strokeWidth="2"/><circle cx="18" cy="19" r="3" stroke={color} strokeWidth="2"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  FileText: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={color} strokeWidth="2" strokeLinejoin="round"/><polyline points="14 2 14 8 20 8" stroke={color} strokeWidth="2" strokeLinejoin="round"/><line x1="16" y1="13" x2="8" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="16" y1="17" x2="8" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Infinity: ({size=28,color="white"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4zm0 0c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z" stroke={color} strokeWidth="2"/></svg>,
  GraduationCap: ({size=48,color="white"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 12v5c3 3 9 3 12 0v-5" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Sun: ({size=20,color="#F59E0B"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2"/><line x1="12" y1="1" x2="12" y2="3" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="21" x2="12" y2="23" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="1" y1="12" x2="3" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="21" y1="12" x2="23" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Moon: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Search: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Filter: ({size=18,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><line x1="4" y1="6" x2="20" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="8" y1="12" x2="16" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="11" y1="18" x2="13" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Map: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="8" y1="2" x2="8" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="16" y1="6" x2="16" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Shield: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="9 12 11 14 15 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  CreditCard: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="1" y="4" width="22" height="16" rx="2" stroke={color} strokeWidth="2"/><line x1="1" y1="10" x2="23" y2="10" stroke={color} strokeWidth="2"/><line x1="5" y1="16" x2="9" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="16" x2="14" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Smartphone: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" stroke={color} strokeWidth="2"/><line x1="12" y1="18" x2="12.01" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Diamond: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M6 3h12l4 6-10 13L2 9z" stroke={color} strokeWidth="2" strokeLinejoin="round"/><path d="M2 9h20M6 3l4 6m4 0l4-6M6 3L2 9l10 13M18 3l4 6-10 13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  ShieldCheck: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="9 12 11 14 15 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  ClickPay: ({size=24,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="3" stroke={color} strokeWidth="2"/><path d="M2 10h20" stroke={color} strokeWidth="2"/><circle cx="7" cy="15" r="1.5" fill={color}/><path d="M11 14h6" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Gift:       ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><polyline points="20 12 20 22 4 22 4 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="2" y="7" width="20" height="5" rx="1" stroke={color} strokeWidth="2"/><line x1="12" y1="22" x2="12" y2="7" stroke={color} strokeWidth="2" strokeLinecap="round"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Celebrate:  ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M3 21l7-7" stroke={color} strokeWidth="2" strokeLinecap="round"/><path d="M7 3l1 4L3 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 3l-1 4 4 1" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 21l4-1 1 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 13a6 6 0 0 0 8.5-8.5" stroke={color} strokeWidth="2" strokeLinecap="round"/><circle cx="16" cy="8" r="1" fill={color}/><circle cx="12" cy="4" r="1" fill={color}/><circle cx="20" cy="12" r="1" fill={color}/></svg>,
  Send:       ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><line x1="22" y1="2" x2="11" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polygon points="22 2 15 22 11 13 2 9 22 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Traffic:    ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="8" y="2" width="8" height="20" rx="2" stroke={color} strokeWidth="2"/><circle cx="12" cy="7" r="2" fill={color}/><circle cx="12" cy="12" r="2" fill={color}/><circle cx="12" cy="17" r="2" fill={color}/></svg>,
  RoadSign:   ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M12 2L2 12l10 10 10-10z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 8v4M12 16h.01" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Refresh:    ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><polyline points="23 4 23 10 17 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="1 20 1 14 7 14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Walk:       ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="4" r="2" stroke={color} strokeWidth="2"/><path d="M9 20l1-5-2-3 3-4 3 3 2-3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 20l-1-5" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Weather:    ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="8" y1="19" x2="8" y2="21" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="8" y1="13" x2="8" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="16" y1="19" x2="16" y2="21" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="16" y1="13" x2="16" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="21" x2="12" y2="23" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="15" x2="12" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Speed:      ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M12 2a10 10 0 1 0 10 10" stroke={color} strokeWidth="2" strokeLinecap="round"/><path d="M12 12l4-4" stroke={color} strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="12" r="2" stroke={color} strokeWidth="2"/></svg>,
  Ambulance:  ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="1" y="9" width="15" height="13" rx="2" stroke={color} strokeWidth="2"/><path d="M16 13h4l3 3v4h-7V13z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="5.5" cy="18.5" r="2.5" stroke={color} strokeWidth="2"/><circle cx="18.5" cy="18.5" r="2.5" stroke={color} strokeWidth="2"/><path d="M7 6h4M9 4v4" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Wrench:     ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  NoEntry:    ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Warning:    ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={color} strokeWidth="2" strokeLinejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Plus: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2.5" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></svg>,
  Trash: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 11v5M14 11v5M9 6V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Users: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke={color} strokeWidth="2" strokeLinecap="round"/><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Percent: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><line x1="19" y1="5" x2="5" y2="19" stroke={color} strokeWidth="2" strokeLinecap="round"/><circle cx="6.5" cy="6.5" r="2.5" stroke={color} strokeWidth="2"/><circle cx="17.5" cy="17.5" r="2.5" stroke={color} strokeWidth="2"/></svg>,
  RotateCcw: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><polyline points="1 4 1 10 7 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Mandatory:  ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/><polyline points="9 12 11 14 15 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Prohibit:   ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/><path d="M4.93 4.93l14.14 14.14" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Hospital:   ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="2"/><path d="M12 8v8M8 12h8" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Train:      ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="14" rx="3" stroke={color} strokeWidth="2"/><path d="M4 11h16" stroke={color} strokeWidth="2"/><circle cx="9" cy="18" r="2" stroke={color} strokeWidth="2"/><circle cx="15" cy="18" r="2" stroke={color} strokeWidth="2"/><path d="M9 17l-2 3M15 17l2 3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Ticket2:    ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1.5a1.5 1.5 0 0 0 0 3V15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1.5a1.5 1.5 0 0 0 0-3V9z" stroke={color} strokeWidth="2"/></svg>,
  Stats:      ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><line x1="18" y1="20" x2="18" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="20" x2="12" y2="4" stroke={color} strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="20" x2="6" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  GraduationCap2: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  TelegramIcon: ({size=20,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-16.5 7a2.25 2.25 0 0 0 .126 4.198l3.938 1.317 1.49 4.47a2.25 2.25 0 0 0 3.916.605l1.9-2.534 3.96 2.64a2.25 2.25 0 0 0 3.372-1.612l2-14a2.25 2.25 0 0 0-3.18-2.3z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M10.5 14l-2-6.5 9-5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  PaymePay: ({size=24,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="6" y="2" width="12" height="20" rx="3" stroke={color} strokeWidth="2"/><path d="M10 6h4" stroke={color} strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="17" r="1.5" fill={color}/><path d="M9 11h6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><path d="M10 13.5h4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>,
};


// ─── STYLE CONSTANTS — takrorlanadigan style lar ───
// Bu yerda bir marta aniqlanadi, har render da qayta yaratilmaydi
const SC = {
  // Screen wrapper
  screen: (C) => ({ minHeight:"100vh", background:C.bg, paddingBottom:80 }),
  // Header gradient
  header: (C, extra={}) => ({ background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`, padding:"52px 20px 20px", ...extra }),
  // Card
  card: (C) => ({ background:C.card, borderRadius:16, padding:20, border:`1px solid ${C.cardBorder}`, boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }),
  // Primary button
  btnPrimary: (C) => ({ width:"100%", padding:"16px", borderRadius:16, border:"none", background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`, color:"white", fontSize:16, fontWeight:800, cursor:"pointer", boxShadow:`0 6px 20px ${C.primary}50` }),
  // Row
  row: { display:"flex", alignItems:"center" },
  // Text styles
  title: (C) => ({ fontWeight:800, fontSize:22, color:C.text, margin:0 }),
  sub: (C) => ({ fontSize:13, color:C.subtext }),
  label: (C) => ({ fontSize:12, color:C.subtext, fontWeight:500 }),
};

// ─── DATA ───
// ─── LIMITLAR (admin tomonidan boshqariladi) ───
const LIMITS = {
  dailyTestLimit: 100,
  freeExamCount: 2,
  freeTicketCount: 10,
};


// ─── BACKEND API ───
const API_URL = "http://uz04.ahost.uz/api";

// API helper funksiyalar
async function apiGet(endpoint, token) {
  const res = await fetch(API_URL + endpoint, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function apiPost(endpoint, data, token) {
  const res = await fetch(API_URL + endpoint, {
    method: 'POST',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function apiPatch(endpoint, data, token) {
  const res = await fetch(API_URL + endpoint, {
    method: 'PATCH',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function apiDelete(endpoint, token) {
  const res = await fetch(API_URL + endpoint, {
    method: 'DELETE',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// FormData (fayl) yuborish uchun — Content-Type avtomatik qo'yiladi
async function apiUpload(endpoint, formData, token, method = 'POST') {
  const res = await fetch(API_URL + endpoint, {
    method,
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
    body: formData,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Test/Bilet/Imtihon natijasini backendga yuboradi (statistika uchun).
// `questions` — savollar ro'yxati (har birida `correct` va `topicIndex`),
// `answers` — {savolIndex: tanlangan variant}
async function submitTestResult(type, questions, answers, token) {
  if (!token) return;
  let correct = 0, wrong = 0;
  const topicMistakes = {};
  questions.forEach((q, i) => {
    if (answers[i] === q.correct) {
      correct++;
    } else {
      wrong++;
      const topicId = TOPICS_DATA[q.topicIndex]?.id;
      if (topicId) topicMistakes[topicId] = (topicMistakes[topicId] || 0) + 1;
    }
  });
  try {
    await apiPost('/results', { type, correct, wrong, total: questions.length, topicMistakes }, token);
  } catch (err) {
    console.warn('Natija yuborilmadi:', err);
  }
}

// ─── APP KONFIGURATSIYASI (admin tomonidan boshqariladi) ───
const APP_CONFIG = {
  botUsername: "NazariyBot",            // Telegram bot username (taklif havolalari uchun)
  supportUsername: "nazariy_support",   // Telegram support username (@siz)
  newsChannel: "nazariy_avtotest",      // Telegram kanal username
  aboutText: {
    uz: "Nazariy — O'zbekiston haydovchilik guvohnomasi olish uchun nazariy imtihonga tayyorgarlik ko'rish ilovasi. 100 ta rasmiy bilet, testlar va imtihon rejimlari.",
    ru: "Nazariy — приложение для подготовки к теоретическому экзамену на водительские права в Узбекистане. 100 официальных билетов, тесты и режим экзамена.",
    kril: "Назарий — Ўзбекистон ҳайдовчилик гувоҳномаси олиш учун назарий имтиҳонга тайёргарлик кўриш иловаси.",
  },
  version: "2.0.0",
};

// ─── CHEGIRMA KONFIGURATSIYASI ───
// Admin paneldan boshqariladi
const DISCOUNT = {
  active: true,           // Chegirma faolmi
  percent: 20,            // Foiz chegirma (20%)
  label: "Maxsus taklif", // Chegirma sarlavhasi
  endDate: "2025-07-01",  // Tugash sanasi (YYYY-MM-DD)
  code: "",               // Promo-kod (bo'sh = hamma uchun)
};

// Pro tariflar narxlari (so'mda, chegirmasiz) — admin tomonidan o'zgartiriladi
const PRICES = {
  week: 9900,
  month1: 29900,
  month2: 49900,
};

// ─── ADMINLAR VA HUQUQLAR ───
// role: "super" — barcha huquqlar, "content" — bilet/mavzu/qoidalar, "support" — bildirishnoma/foydalanuvchilar
const ADMIN_ROLES = {
  super:   { uz:"Super admin",      ru:"Супер админ",       kril:"Супер админ" },
  content: { uz:"Kontent admin",    ru:"Контент админ",     kril:"Контент админ" },
  support: { uz:"Qo'llab-quvvatlash admin", ru:"Админ поддержки", kril:"Қўллаб-қувватлаш админи" },
};
const ADMIN_PERMS = {
  super:   ["tickets","topics","rules","notifications","pro","admins"],
  content: ["tickets","topics","rules"],
  support: ["notifications"],
};
let ADMINS = [
  { id:1, tgId:"000000001", name:"Alisher Karimov", username:"alisher_admin", role:"super" },
];

// ─── PRO OBUNA SO'ROVLARI ───
// status: "pending" | "approved" | "rejected"
let PRO_REQUESTS = [
  { id:1001, name:"Sardor Toshmatov", username:"sardor_t", planLabel:"1 oylik", amount:"29 900", receiptName:"chek_1001.jpg", status:"pending", isMe:false, tgId:null },
  { id:1002, name:"Madina Yusupova", username:"madina_y", planLabel:"Haftalik", amount:"9 900",  receiptName:"chek_1002.jpg", status:"pending", isMe:false, tgId:null },
];

// ─── REFERAL ORQALI PRO BERISH SO'ROVLARI ───
let REFERRAL_GRANTS = [
  { id:2001, name:"Jasur Rahimov", username:"jasur_r", milestoneLabel:"3 do'st → Haftalik Pro", days:7,  status:"pending", isMe:false, tgId:null },
  { id:2002, name:"Kamola Aliyeva", username:"kamola_a", milestoneLabel:"5 do'st → 1 oylik Pro", days:30, status:"pending", isMe:false, tgId:null },
];


let SENT_NOTIFICATIONS = [];

// ─── TASDIQLASH KUTAYOTGAN O'ZGARISHLAR ───
// Super admin bo'lmagan adminlarning o'zgarishlari shu yerga tushadi
// va super admin tasdiqlamaguncha asosiy ma'lumotlarga ta'sir qilmaydi
let PENDING_CHANGES = [];

// ─── ADMIN MA'LUMOTLARINI LOCAL SAQLASH ───
// Admin paneldagi o'zgarishlar (biletlar, mavzular, qoidalar, adminlar, sozlamalar)
// brauzerning localStorage'ida saqlanadi va sahifa qayta yuklanganda tiklanadi.
const ADMIN_STORAGE_KEY = "nazariy_admin_data_v1";

function loadPersistedAdminData() {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    const raw = window.localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (Array.isArray(data.tickets)) { tickets.length = 0; tickets.push(...data.tickets); }
    if (Array.isArray(data.TOPICS_DATA)) { TOPICS_DATA.length = 0; TOPICS_DATA.push(...data.TOPICS_DATA); }
    if (Array.isArray(data.SIGNS_CATEGORIES)) { SIGNS_CATEGORIES.length = 0; SIGNS_CATEGORIES.push(...data.SIGNS_CATEGORIES); }
    if (Array.isArray(data.ADMINS)) ADMINS = data.ADMINS;
    if (Array.isArray(data.PRO_REQUESTS)) PRO_REQUESTS = data.PRO_REQUESTS;
    if (Array.isArray(data.REFERRAL_GRANTS)) REFERRAL_GRANTS = data.REFERRAL_GRANTS;
    if (Array.isArray(data.SENT_NOTIFICATIONS)) SENT_NOTIFICATIONS = data.SENT_NOTIFICATIONS;
    if (Array.isArray(data.PENDING_CHANGES)) PENDING_CHANGES = data.PENDING_CHANGES;
    if (data.DISCOUNT) Object.assign(DISCOUNT, data.DISCOUNT);
    if (data.LIMITS) Object.assign(LIMITS, data.LIMITS);
    if (data.PRICES) Object.assign(PRICES, data.PRICES);
    if (Array.isArray(data.REFERRAL_MILESTONES)) REFERRAL_CONFIG.milestones = data.REFERRAL_MILESTONES;
  } catch {}
}

function savePersistedAdminData() {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify({
      tickets, TOPICS_DATA, SIGNS_CATEGORIES, ADMINS, PRO_REQUESTS, REFERRAL_GRANTS, SENT_NOTIFICATIONS, PENDING_CHANGES,
      DISCOUNT, LIMITS, PRICES, REFERRAL_MILESTONES: REFERRAL_CONFIG.milestones,
    }));
  } catch {}
}

// Tasdiqlangan o'zgarishni asosiy ma'lumotlarga qo'llaydi
function applyChange(type, payload) {
  switch(type) {
    case "add_ticket":
      tickets.push(payload.ticket);
      break;
    case "delete_ticket": {
      const idx = tickets.findIndex(t=>t.id===payload.ticketId);
      if(idx>-1) tickets.splice(idx,1);
      break;
    }
    case "toggle_ticket_pro": {
      const t = tickets.find(t=>t.id===payload.ticketId);
      if(t) t.isPro = payload.isPro;
      break;
    }
    case "edit_ticket_questions": {
      const t = tickets.find(t=>t.id===payload.ticketId);
      if(t) t.questions = payload.questions;
      break;
    }
    case "add_topic":
      TOPICS_DATA.push(payload.topic);
      break;
    case "delete_topic": {
      const idx = TOPICS_DATA.findIndex(t=>t.id===payload.topicId);
      if(idx>-1) TOPICS_DATA.splice(idx,1);
      break;
    }
    case "add_rule_category":
      SIGNS_CATEGORIES.push(payload.category);
      break;
    case "add_rule_item": {
      const cat = SIGNS_CATEGORIES.find(c=>c.id===payload.catId);
      if(cat){ cat.items.push(payload.item); cat.count = cat.items.length; }
      break;
    }
    case "delete_rule_item": {
      const cat = SIGNS_CATEGORIES.find(c=>c.id===payload.catId);
      if(cat){ cat.items.splice(payload.itemIndex,1); cat.count = cat.items.length; }
      break;
    }
  }
}


const REFERRAL_CONFIG = {
  milestones: [
    { count: 3,  reward: "week",   labelKey: "proWeekly", days: 7  },
    { count: 5,  reward: "month1", labelKey: "proMonth1", days: 30 },
    { count: 10, reward: "month2", labelKey: "proMonth2", days: 60 },
  ],
};

// Foydalanuvchi referal kod generatsiyasi (tg_id asosida)
function genReferralCode(user) {
  const base = user?.tgId || user?.username || "USER";
  return ("NAZ" + String(base).slice(-4).toUpperCase() + Math.floor(1000 + (base%9000||1234))).slice(0,10);
}

// Keyingi milestone
function nextMilestone(count) {
  return REFERRAL_CONFIG.milestones.find(m => m.count > count) || null;
}

// Chegara hisoblash yordamchi funksiya
// Chegirma hisoblash yordamchi funksiya
function calcDiscounted(price) {
  if (!DISCOUNT.active || !DISCOUNT.percent) return { original: price, final: price, saved: 0 };
  const saved = Math.round(price * DISCOUNT.percent / 100);
  return { original: price, final: price - saved, saved };
}

// Tugash sanasiga qolgan kunlar
function discountDaysLeft() {
  if (!DISCOUNT.active || !DISCOUNT.endDate) return null;
  const diff = new Date(DISCOUNT.endDate) - new Date();
  return Math.max(0, Math.ceil(diff / 86400000));
}

// ─── SESSION STORAGE — kunlik hisoblagich ───
function getTodayKey() {
  return new Date().toISOString().slice(0,10);
}
function getDailyCount(key) {
  try {
    const data = JSON.parse(sessionStorage.getItem('daily_' + key) || '{}');
    return data[getTodayKey()] || 0;
  } catch { return 0; }
}
function incDailyCount(key) {
  try {
    const stKey = 'daily_' + key;
    const data = JSON.parse(sessionStorage.getItem(stKey) || '{}');
    data[getTodayKey()] = (data[getTodayKey()] || 0) + 1;
    sessionStorage.setItem(stKey, JSON.stringify(data));
  } catch {}
}

// Biletlar: 1-10 bepul, 11-100 Pro
const tickets = Array.from({length:100},(_,i)=>({
  id:i+1,
  isPro: i >= 10,  // 11-dan boshlab Pro
  questions:Array.from({length:20},(_,j)=>({ 
    id:j+1, question:j, sign:j%3===0?j%8:null, options:j%10, correct:0,
    explanation:{
      uz: "Yo'l harakati qoidalari bo'yicha to'g'ri javob: haydovchi belgilangan tartibda harakat qilishi shart.",
      ru: "Согласно правилам дорожного движения: водитель обязан соблюдать установленный порядок движения.",
      kril: "Йўл ҳаракати қоидалари бўйича тўғри жавоб: ҳайдовчи белгиланган тартибда ҳаракат қилиши шарт."
    }
  }))
}));

const QUESTIONS = [
  "Quyidagi rasmda qaysi yo'l belgisi ko'rsatilgan? / Какой знак изображён на рисунке? / Қуйидаги расмда қайси йўл белгиси кўрсатилган?",
  "Yo'l harakatida chapga burilish qachon taqiqlanadi? / Когда запрещён поворот налево? / Йўл ҳаракатида чапга бурилиш қачон тақиқланади?",
  "Tuman sharoitida to'xtash masofasi qanday o'zgaradi? / Как меняется тормозной путь в туман? / Туман шароитида тўхташ масофаси қандай ўзгаради?",
  "Piyodalar o'tish joyida haydovchi nima qilishi kerak? / Что должен делать водитель на пешеходном переходе? / Пиёдалар ўтиш жойида ҳайдовчи нима қилиши керак?",
  "Yashil chiroqda haydovchi nima qilishi kerak? / Что делать водителю на зелёный сигнал? / Яшил чироқда ҳайдовчи нима қилиши керак?",
  "Yo'lda ustunlik huquqi kimda bo'ladi? / Кто имеет преимущество на дороге? / Йўлда устунлик ҳуқуқи кимда бўлади?",
  "Qanday holatda signal chalinishi mumkin? / В каком случае разрешено подавать сигнал? / Қандай ҳолатда сигнал чалиниши мумкин?",
  "Avtomobil tormoz yo'li nimaga bog'liq? / От чего зависит тормозной путь? / Автомобил тормоз йўли нимага боғлиқ?",
  "Shahar ichida maksimal tezlik qancha? / Какова максимальная скорость в городе? / Шаҳар ичида максимал тезлик қанча?",
  "Bolalar tashiydigan avtobusni qanday chetlab o'tish kerak? / Как обогнать автобус с детьми? / Болалар ташийдиган автобусни қандай четлаб ўтиш керак?",
];
const OPTIONS = [
  ["Bolalar","Piyodalar o'tish joyi","Ehtiyot bo'ling","Maktab yaqinida"],
  ["Chapga burilish belgisi bo'lmasa","Har doim","Trafik tirband bo'lsa","Yo'l tor bo'lsa"],
  ["2 barobar uzayadi","Qisqaradi","O'zgarmaydi","Tezlik taqiqlanadi"],
  ["To'xtash kerak","Tezlashish kerak","Signal berish","Harakatni davom ettirish"],
  ["Harakatni davom ettirish","To'xtatish","Chiroqni kutish","Signal berish"],
  ["Asosiy yo'ldagi haydovchida","Ikkilamchi yo'lda","Ikkoviga teng","Tezroq harakatlanuvchida"],
  ["Xavfli vaziyatda","Har doim","Tungi paytda","Shaharda hech qachon"],
  ["Tezlikka","Yo'l yuzasiga","Ob-havoga","Barcha omillarga"],
  ["60 km/s","80 km/s","50 km/s","70 km/s"],
  ["Chap tarafdan","O'ng tarafdan","Har ikki tarafdan","To'xtab kutish"],
];
const SIGNS = ["warn","no-left","stop","ped","children","no-entry","speed","rail"];
// q.sign eski formatda son (0-7) yoki admin tomonidan kiritilgan SIGNS qatoridan satr bo'lishi mumkin
function getSignType(sign) {
  if(sign===null || sign===undefined || sign==="") return null;
  if(typeof sign === "string") return SIGNS.includes(sign) ? sign : null;
  return SIGNS[sign%8];
}

function SignSVG({type}) {
  const shapes = { stop:"oct", "no-entry":"oct", warn:"tri", children:"tri" };
  const s = shapes[type]||"circ";
  const bg = { warn:"#FFD600","no-left":"#EF4444",stop:"#EF4444",ped:"#F59E0B",children:"#F59E0B","no-entry":"#EF4444",speed:"white",rail:"#1A6BFF" }[type]||"#EEE";
  return (
    <svg width="90" height="90" viewBox="0 0 90 90">
      {s==="tri"&&<polygon points="45,8 82,75 8,75" fill={bg} stroke="#333" strokeWidth="3"/>}
      {s==="circ"&&<circle cx="45" cy="45" r="38" fill={bg} stroke="#333" strokeWidth="3"/>}
      {s==="oct"&&<polygon points="28,10 62,10 80,28 80,62 62,80 28,80 10,62 10,28" fill={bg} stroke="#333" strokeWidth="3"/>}
      {type==="warn"&&<text x="45" y="66" textAnchor="middle" fontSize="34" fill="#333" fontWeight="900">!</text>}
      {type==="ped"&&<><circle cx="45" cy="22" r="7" fill="#333"/><path d="M45 29v14M38 35l7-4 7 4M40 43l5-4M50 43l-5-4" stroke="#333" strokeWidth="2.5" strokeLinecap="round"/></>}
      {type==="children"&&<><circle cx="45" cy="30" r="9" fill="#333"/><path d="M36 48c0-5 4-9 9-9s9 4 9 9" stroke="#333" strokeWidth="2.5" strokeLinecap="round" fill="none"/></>}
      {type==="no-left"&&<><line x1="30" y1="45" x2="60" y2="45" stroke="white" strokeWidth="6"/><polyline points="43,34 30,45 43,56" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round"/><line x1="15" y1="15" x2="75" y2="75" stroke="white" strokeWidth="5"/></>}
      {type==="stop"&&<text x="45" y="57" textAnchor="middle" fontSize="18" fontWeight="900" fill="white">STOP</text>}
      {type==="no-entry"&&<rect x="22" y="41" width="46" height="8" rx="3" fill="white"/>}
      {type==="speed"&&<><circle cx="45" cy="45" r="28" fill="#EF4444" stroke="white" strokeWidth="4"/><text x="45" y="54" textAnchor="middle" fontSize="22" fontWeight="900" fill="white">60</text></>}
      {type==="rail"&&<><rect x="22" y="28" width="46" height="30" rx="6" fill="white" opacity="0.9"/><circle cx="34" cy="62" r="5" fill="white"/><circle cx="56" cy="62" r="5" fill="white"/><line x1="29" y1="38" x2="29" y2="52" stroke="#1A6BFF" strokeWidth="2.5"/><line x1="61" y1="38" x2="61" y2="52" stroke="#1A6BFF" strokeWidth="2.5"/><line x1="22" y1="45" x2="68" y2="45" stroke="#1A6BFF" strokeWidth="1.5"/></>}
    </svg>
  );
}

function getQ(q,lang) {
  // Admin tomonidan kiritilgan maxsus savol matni (obyekt)
  if(q && typeof q === "object") return q[lang] || q.uz || "";
  const parts = QUESTIONS[q%10].split(" / ");
  return parts[lang==="ru"?1:lang==="kril"?2:0];
}
function getOpts(q,lang) {
  // Admin tomonidan kiritilgan maxsus javob variantlari (obyekt)
  if(q && typeof q === "object" && !Array.isArray(q)) return q[lang] || q.uz || ["","","",""];
  if(lang==="ru"){
    const ru=[["Дети","Пешеходный переход","Осторожно","Рядом школа"],["Если нет знака","Всегда","В пробке","Узкая дорога"],["Увеличивается вдвое","Уменьшается","Не изменяется","Скорость запрещена"],["Остановиться","Ускориться","Сигналить","Продолжать движение"],["Продолжать движение","Остановиться","Ждать","Сигналить"],["У водителя главной дороги","На второстепенной","Поровну","У быстрого"],["В опасной ситуации","Всегда","Ночью","Никогда в городе"],["От скорости","От покрытия","От погоды","От всего"],["60 км/ч","80 км/ч","50 км/ч","70 км/ч"],["Слева","Справа","С обеих сторон","Ждать"]];
    return ru[q%10];
  }
  if(lang==="kril"){
    const kr=[["Болалар","Пиёдалар ўтиш жойи","Эҳтиёт бўлинг","Мактаб яқинида"],["Чапга бурилиш белгиси бўлмаса","Ҳар доим","Трафик тирбанд бўлса","Йўл тор бўлса"],["2 баробар узаяди","Қисқаради","Ўзгармайди","Тезлик тақиқланади"],["Тўхташ керак","Тезлашиш керак","Сигнал бериш","Ҳаракатни давом эттириш"],["Ҳаракатни давом эттириш","Тўхтатиш","Чироқни кутиш","Сигнал бериш"],["Асосий йўлдаги ҳайдовчида","Иккиламчи йўлда","Иккисига тенг","Тезроқ ҳаракатланувчида"],["Хавфли вазиятда","Ҳар доим","Тунги пайтда","Шаҳарда ҳеч қачон"],["Тезликка","Йўл юзасига","Об-ҳавога","Барча омилларга"],["60 км/с","80 км/с","50 км/с","70 км/с"],["Чап тарафдан","Ўнг тарафдан","Ҳар икки тарафдан","Тўхтаб кутиш"]];
    return kr[q%10];
  }
  return OPTIONS[q%10];
}

const leaderboard=[{rank:1,name:"Jasur",xp:1850,av:"J"},{rank:2,name:"Alisher",xp:2460,av:"A",me:true},{rank:3,name:"Sardor",xp:1750,av:"S"},{rank:4,name:"Behzod",xp:1640,av:"B"},{rank:5,name:"Sanjar",xp:1500,av:"SA"},{rank:6,name:"Bobur",xp:1400,av:"BO"}];

// ─── UI COMPONENTS ───
// SVG icons for bottom nav (emoji o'rniga)
const NavIcons = {
  Home: ({size=22,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 21V12h6v9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Duel: ({size=22,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="1" y="1" width="22" height="22" rx="6" stroke={color} strokeWidth="1.5"/>
    <text x="12" y="16.5" textAnchor="middle" fontSize="11" fontWeight="900" fill={color} fontFamily="sans-serif" letterSpacing="1">VS</text>
    <line x1="4" y1="4" x2="7" y2="7" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
    <line x1="20" y1="4" x2="17" y2="7" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
  </svg>,
  Exam: ({size=22,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="2" stroke={color} strokeWidth="2"/><path d="M8 7h8M8 11h8M8 15h5" stroke={color} strokeWidth="2" strokeLinecap="round"/><circle cx="18" cy="17" r="3" fill={color} opacity="0.8"/><path d="M17 17l.8.8 1.7-1.6" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Referral: ({size=22,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke={color} strokeWidth="2" strokeLinecap="round"/><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
  Profile: ({size=22,color="#94A3B8"})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>,
};

function BottomNav({screen,setScreen,T,C}) {
  const tabs=[
    {id:"home",     label:T.home,     Icon:NavIcons.Home},
    {id:"duel",     label:T.duel,     Icon:NavIcons.Duel},
    {id:"exam",     label:T.exam,     Icon:NavIcons.Exam},
    {id:"referral", label:T.referral, Icon:NavIcons.Referral},
    {id:"profile",  label:T.profile,  Icon:NavIcons.Profile},
  ];
  // Telegram va iPhone uchun pastki safe area
  const safeBottom = typeof window !== "undefined"
    ? (window?.Telegram?.WebApp?.safeAreaInset?.bottom || 0)
    : 0;
  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,width:"100%",background:C.navBg,borderTop:`1px solid ${C.gray200}`,display:"flex",flexDirection:"row",zIndex:100,boxShadow:"0 -4px 20px rgba(0,0,0,0.1)",paddingBottom:safeBottom}}>
      {tabs.map(tab=>{
        const active=screen===tab.id||screen.startsWith(tab.id);
        return <button key={tab.id} onClick={()=>setScreen(tab.id)} style={{flex:1,padding:"10px 0 14px",border:"none",background:"transparent",display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer"}}>
          <tab.Icon size={22} color={active?C.primary:C.gray400}/>
          <span style={{fontSize:10,fontWeight:active?600:400,color:active?C.primary:C.gray400}}>{tab.label}</span>
        </button>;
      })}
    </div>
  );
}

function PhoneWrapper({children,showNav,screen,setScreen,T,C}) {
  return <div style={{width:"100%",minHeight:"100vh",background:C.bg,position:"relative",fontFamily:"'DM Sans','Segoe UI',sans-serif",paddingBottom:showNav?70:0}}>
    {children}
    {showNav&&<BottomNav screen={screen} setScreen={setScreen} T={T} C={C}/>}
  </div>;
}

function Btn({children,onClick,variant="primary",style={},disabled,C}) {
  const v={primary:{background:C.primary,color:"white"},outline:{background:"transparent",color:C.primary,border:`2px solid ${C.primary}`},danger:{background:C.danger,color:"white"}};
  return <button onClick={disabled?undefined:onClick} style={{padding:"14px 20px",borderRadius:14,border:"none",cursor:disabled?"not-allowed":"pointer",fontWeight:600,fontSize:15,width:"100%",opacity:disabled?0.6:1,...v[variant],...style}}>{children}</button>;
}

function Card({children,style={},C,onClick}) {
  return <div onClick={onClick} style={{background:C.card,borderRadius:16,padding:16,boxShadow:C===undefined?"0 2px 12px rgba(0,0,0,0.06)":`0 2px 12px rgba(0,0,0,0.12)`,border:`1px solid ${C.cardBorder}`,...style}}>{children}</div>;
}

function CircleProgress({percent,size=56,color}) {
  const r=(size-6)/2,circ=2*Math.PI*r;
  return <svg width={size} height={size}>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E2E8F0" strokeWidth={5}/>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5} strokeDasharray={circ} strokeDashoffset={circ-(percent/100)*circ} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}/>
    <text x="50%" y="54%" textAnchor="middle" fontSize={size*0.22} fontWeight="700" fill={color}>{percent}%</text>
  </svg>;
}

// Lang selector modal
function LangModal({visible,onClose,lang,setLang,C}) {
  if(!visible) return null;
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
    <div style={{width:"100%",maxWidth:600,background:C.card,borderRadius:"24px 24px 0 0",padding:24}} onClick={e=>e.stopPropagation()}>
      <div style={{width:40,height:4,background:C.gray300,borderRadius:100,margin:"0 auto 20px"}}/>
      <div style={{fontWeight:700,fontSize:18,color:C.text,marginBottom:16}}>Tilni tanlang / Выберите язык</div>
      {Object.values(LANGS).map(l=>(
        <div key={l.code} onClick={()=>{setLang(l.code);onClose();}} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderRadius:14,marginBottom:8,background:lang===l.code?C.primary+"22":"transparent",border:`1.5px solid ${lang===l.code?C.primary:C.gray200}`,cursor:"pointer"}}>
          <span style={{fontWeight:600,fontSize:15,color:lang===l.code?C.primary:C.text}}>{l.label}</span>
          {lang===l.code&&<div style={{marginLeft:"auto"}}><IC.CheckCircle size={20} color={C.primary}/></div>}
        </div>
      ))}
    </div>
  </div>;
}

// Dark mode toggle button
function DarkToggle({dark,setDark,C,T}) {
  return <button onClick={()=>setDark(!dark)} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",borderRadius:20,border:`1.5px solid ${C.gray200}`,background:C.card,cursor:"pointer"}}>
    {dark?<IC.Sun size={16} color="#F59E0B"/>:<IC.Moon size={16} color={C.gray400}/>}
    <span style={{fontSize:12,fontWeight:600,color:C.subtext}}>{dark?T.lightMode:T.darkMode}</span>
  </button>;
}

// ─── SCREENS ───
// ─── ONBOARDING ───
const OB_SLIDES = [
  {
    titleKey:"ob1Title", subKey:"ob1Sub",
    accent:"#1A6BFF",
    gradA:"#1A6BFF", gradB:"#6366F1",
    illustration:(
      <svg viewBox="0 0 280 220" width="280" height="220">
        {/* Road */}
        <rect x="0" y="140" width="280" height="80" rx="0" fill="rgba(255,255,255,0.08)"/>
        <rect x="120" y="148" width="40" height="8" rx="4" fill="rgba(255,255,255,0.3)"/>
        <rect x="120" y="168" width="40" height="8" rx="4" fill="rgba(255,255,255,0.3)"/>
        {/* Car body */}
        <rect x="80" y="100" width="120" height="50" rx="14" fill="white"/>
        <rect x="96" y="78" width="84" height="36" rx="12" fill="white" opacity="0.9"/>
        {/* Windows */}
        <rect x="102" y="84" width="32" height="24" rx="6" fill="#6366F1" opacity="0.4"/>
        <rect x="142" y="84" width="32" height="24" rx="6" fill="#6366F1" opacity="0.4"/>
        {/* Wheels */}
        <circle cx="110" cy="152" r="14" fill="#1E293B"/>
        <circle cx="110" cy="152" r="7" fill="white" opacity="0.5"/>
        <circle cx="170" cy="152" r="14" fill="#1E293B"/>
        <circle cx="170" cy="152" r="7" fill="white" opacity="0.5"/>
        {/* Headlights */}
        <rect x="190" y="112" width="14" height="8" rx="4" fill="#FEF3C7"/>
        <rect x="190" y="126" width="14" height="8" rx="4" fill="#FEF3C7" opacity="0.6"/>
        {/* N logo on car */}
        <rect x="124" y="108" width="32" height="26" rx="6" fill="#1A6BFF"/>
        <text x="140" y="126" textAnchor="middle" fontSize="16" fontWeight="900" fill="white" fontFamily="serif">N</text>
        {/* Scenery */}
        <circle cx="30" cy="110" r="22" fill="rgba(255,255,255,0.08)"/>
        <circle cx="250" cy="100" r="18" fill="rgba(255,255,255,0.06)"/>
        <circle cx="40" cy="55" r="5" fill="rgba(255,255,255,0.5)"/>
        <circle cx="240" cy="40" r="3" fill="rgba(255,255,255,0.4)"/>
        <circle cx="260" cy="75" r="4" fill="rgba(255,255,255,0.3)"/>
        <circle cx="18" cy="80" r="3" fill="rgba(255,255,255,0.35)"/>
        {/* Speed lines */}
        <line x1="20" y1="120" x2="60" y2="120" stroke="rgba(255,255,255,0.2)" strokeWidth="3" strokeLinecap="round"/>
        <line x1="15" y1="130" x2="50" y2="130" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    titleKey:"ob2Title", subKey:"ob2Sub",
    accent:"#8B5CF6",
    gradA:"#7C3AED", gradB:"#4F46E5",
    illustration:(
      <svg viewBox="0 0 280 220" width="280" height="220">
        {/* Stacked ticket cards */}
        {[2,1,0].map(i=>(
          <g key={i} transform={`translate(${14+i*12},${50+i*10})`} opacity={i===0?1:i===1?0.7:0.45}>
            <rect x="0" y="0" width="200" height="110" rx="18" fill="white"/>
            <circle cx="0" cy="55" r="12" fill="#4F46E5" opacity="0.15"/>
            <circle cx="200" cy="55" r="12" fill="#4F46E5" opacity="0.15"/>
            <rect x="20" y="22" width="90" height="10" rx="5" fill="#7C3AED" opacity={0.35-i*0.05}/>
            <rect x="20" y="40" width="60" height="8" rx="4" fill="#7C3AED" opacity={0.2-i*0.03}/>
            <rect x="20" y="56" width="75" height="8" rx="4" fill="#7C3AED" opacity={0.15-i*0.02}/>
            <circle cx="152" cy="55" r="26" fill="#7C3AED" opacity={i===0?0.12:0.07}/>
            <text x="152" y="61" textAnchor="middle" fontSize="18" fontWeight="900" fill="#7C3AED" opacity={i===0?0.9:0.5}>20</text>
          </g>
        ))}
        {/* Check badge */}
        <circle cx="220" cy="170" r="28" fill="#22C55E"/>
        <polyline points="208,170 217,180 234,160" stroke="white" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Dots */}
        <circle cx="28" cy="188" r="5" fill="rgba(255,255,255,0.4)"/>
        <circle cx="44" cy="196" r="3" fill="rgba(255,255,255,0.3)"/>
        <circle cx="258" cy="50" r="4" fill="rgba(255,255,255,0.35)"/>
      </svg>
    )
  },
  {
    titleKey:"ob3Title", subKey:"ob3Sub",
    accent:"#EF4444",
    gradA:"#F59E0B", gradB:"#EF4444",
    illustration:(
      <svg viewBox="0 0 280 220" width="280" height="220">
        {/* Big clock */}
        <circle cx="140" cy="105" r="80" fill="rgba(255,255,255,0.07)"/>
        <circle cx="140" cy="105" r="66" fill="rgba(255,255,255,0.1)"/>
        <circle cx="140" cy="105" r="54" fill="rgba(255,255,255,0.15)"/>
        {/* Ticks */}
        {[0,30,60,90,120,150,180,210,240,270,300,330].map(a=>{
          const big=[0,90,180,270].includes(a);
          const r=54,rad=a*Math.PI/180;
          const len=big?10:6;
          const x1=140+r*Math.sin(rad),y1=105-r*Math.cos(rad);
          const x2=140+(r-len)*Math.sin(rad),y2=105-(r-len)*Math.cos(rad);
          return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth={big?2.5:1.5} opacity={big?0.9:0.5}/>;
        })}
        {/* Hour numbers */}
        {[12,3,6,9].map((n,i)=>{
          const a=(i*90-90)*Math.PI/180;
          const r=42;
          return <text key={n} x={140+r*Math.cos(a)} y={105+r*Math.sin(a)+4} textAnchor="middle" fontSize="11" fontWeight="700" fill="white" opacity="0.8">{n}</text>;
        })}
        {/* Clock hands */}
        <line x1="140" y1="105" x2="140" y2="62" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
        <line x1="140" y1="105" x2="168" y2="120" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="140" y1="105" x2="112" y2="98" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="140" cy="105" r="5" fill="white"/>
        {/* Error indicator */}
        <rect x="30" y="175" width="50" height="22" rx="11" fill="rgba(255,255,255,0.2)"/>
        <text x="55" y="190" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">0 / 2</text>
        <rect x="200" y="175" width="50" height="22" rx="11" fill="#EF4444" opacity="0.8"/>
        <text x="225" y="190" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">2 / 2</text>
        <circle cx="258" cy="48" r="4" fill="rgba(255,255,255,0.4)"/>
        <circle cx="24" cy="70" r="3" fill="rgba(255,255,255,0.3)"/>
      </svg>
    )
  },
  {
    titleKey:"ob4Title", subKey:"ob4Sub",
    accent:"#22C55E",
    gradA:"#10B981", gradB:"#0891B2",
    illustration:(
      <svg viewBox="0 0 280 220" width="280" height="220">
        {/* Podium */}
        <rect x="60" y="155" width="52" height="44" rx="10" fill="rgba(255,255,255,0.25)"/>
        <rect x="114" y="130" width="52" height="69" rx="10" fill="rgba(255,255,255,0.4)"/>
        <rect x="168" y="165" width="52" height="34" rx="10" fill="rgba(255,255,255,0.2)"/>
        {/* Podium numbers */}
        <text x="86" y="182" textAnchor="middle" fontSize="16" fontWeight="900" fill="white" opacity="0.8">2</text>
        <text x="140" y="168" textAnchor="middle" fontSize="20" fontWeight="900" fill="#FFD700">1</text>
        <text x="194" y="190" textAnchor="middle" fontSize="14" fontWeight="900" fill="white" opacity="0.7">3</text>
        {/* Avatars on podium */}
        <circle cx="86" cy="140" r="18" fill="rgba(255,255,255,0.3)"/>
        <text x="86" y="146" textAnchor="middle" fontSize="14" fill="white" fontWeight="700">J</text>
        <circle cx="140" cy="112" r="22" fill="white" opacity="0.95"/>
        <text x="140" y="120" textAnchor="middle" fontSize="16" fill="#10B981" fontWeight="900">A</text>
        <circle cx="194" cy="152" r="16" fill="rgba(255,255,255,0.25)"/>
        <text x="194" y="157" textAnchor="middle" fontSize="13" fill="white" fontWeight="700">S</text>
        {/* Crown on 1st */}
        <polygon points="126,98 133,86 140,94 147,86 154,98" fill="#FFD700"/>
        {/* Stars */}
        <circle cx="38" cy="55" r="4" fill="rgba(255,255,255,0.5)"/>
        <circle cx="55" cy="35" r="3" fill="rgba(255,255,255,0.35)"/>
        <circle cx="242" cy="42" r="4" fill="rgba(255,255,255,0.45)"/>
        <circle cx="260" cy="65" r="3" fill="rgba(255,255,255,0.3)"/>
        {/* XP bar */}
        <rect x="60" y="60" width="160" height="12" rx="6" fill="rgba(255,255,255,0.15)"/>
        <rect x="60" y="60" width="110" height="12" rx="6" fill="rgba(255,255,255,0.6)"/>
        <text x="60" y="50" fontSize="10" fill="rgba(255,255,255,0.7)" fontWeight="600">2460 XP</text>
        <text x="220" y="50" fontSize="10" fill="rgba(255,255,255,0.5)" fontWeight="600">3000</text>
      </svg>
    )
  },
];

// Static translations for lang-select screen (before lang is chosen)
const LANG_SELECT_TEXTS = {
  uz:   { title:"Tilni tanlang",    subtitle:"Davom etish uchun qulay tilni tanlang" },
  ru:   { title:"Выберите язык",    subtitle:"Выберите удобный язык для продолжения" },
  kril: { title:"Тилни танланг",    subtitle:"Давом этиш учун қулай тилни танланг" },
};

function OnboardingScreen({onFinish, lang, setLang}) {
  // Step 0 = lang select, steps 1-4 = slides
  const [step, setStep] = useState(0);
  const [selectedLang, setSelectedLang] = useState(lang);

  const T = LANGS[selectedLang];
  const slideIdx = step - 1;
  const slide = OB_SLIDES[slideIdx] || OB_SLIDES[0];
  const isSlide = step > 0;
  const isLast = step === OB_SLIDES.length;

  const confirmLang = () => {
    setLang(selectedLang);
    setStep(1);
  };

  // ── LANG SELECT SCREEN ──
  if(step === 0) {
    const lt = LANG_SELECT_TEXTS[selectedLang];
    return (
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",background:"linear-gradient(160deg,#0F172A,#1E293B)"}}>
        {/* Top decorations */}
        <div style={{position:"relative",height:220,overflow:"hidden",flexShrink:0}}>
          {/* Circles decoration */}
          <div style={{position:"absolute",top:-60,left:-60,width:220,height:220,borderRadius:"50%",background:"rgba(26,107,255,0.12)"}}/>
          <div style={{position:"absolute",top:-30,left:-30,width:140,height:140,borderRadius:"50%",background:"rgba(26,107,255,0.1)"}}/>
          <div style={{position:"absolute",top:40,right:-40,width:180,height:180,borderRadius:"50%",background:"rgba(99,102,241,0.1)"}}/>
          {/* N Logo */}
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:80,height:80,borderRadius:24,background:"linear-gradient(135deg,#1A6BFF,#6366F1)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 40px rgba(26,107,255,0.5)"}}>
            <span style={{color:"white",fontSize:44,fontWeight:900,fontFamily:"serif",lineHeight:1}}>N</span>
          </div>
        </div>

        {/* Content */}
        <div style={{flex:1,padding:"0 28px",display:"flex",flexDirection:"column"}}>
          <h2 style={{color:"white",fontSize:26,fontWeight:900,margin:"0 0 8px",textAlign:"center",letterSpacing:"-0.5px"}}>
            {lt.title}
          </h2>
          <p style={{color:"rgba(255,255,255,0.5)",fontSize:14,margin:"0 0 32px",textAlign:"center",lineHeight:1.5}}>
            {lt.subtitle}
          </p>

          {/* Lang options */}
          <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:32}}>
            {Object.values(LANGS).map(l=>{
              const active = selectedLang === l.code;
              return (
                <div key={l.code} onClick={()=>setSelectedLang(l.code)}
                  style={{
                    display:"flex",alignItems:"center",gap:16,
                    padding:"16px 20px",borderRadius:18,cursor:"pointer",
                    background:active?"rgba(26,107,255,0.15)":"rgba(255,255,255,0.05)",
                    border:`2px solid ${active?"#1A6BFF":"rgba(255,255,255,0.08)"}`,
                    transition:"all 0.2s"
                  }}>
                  {/* Left color bar */}
                  <div style={{width:4,height:36,borderRadius:2,background:active?"#1A6BFF":"rgba(255,255,255,0.15)",transition:"background 0.2s"}}/>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:15,color:active?"white":"rgba(255,255,255,0.7)"}}>
                      {l.label}
                    </div>
                    <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",marginTop:2}}>
                      {l.code==="uz"?"Lotin alifbosi":l.code==="ru"?"Кириллица / Русский":"Кирилл алифбоси"}
                    </div>
                  </div>
                  {/* Radio */}
                  <div style={{width:22,height:22,borderRadius:"50%",border:`2px solid ${active?"#1A6BFF":"rgba(255,255,255,0.2)"}`,background:active?"#1A6BFF":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s"}}>
                    {active&&<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Confirm button */}
          <button onClick={confirmLang}
            style={{width:"100%",padding:"16px",borderRadius:18,border:"none",background:"linear-gradient(135deg,#1A6BFF,#6366F1)",color:"white",fontSize:16,fontWeight:800,cursor:"pointer",boxShadow:"0 4px 24px rgba(26,107,255,0.4)",letterSpacing:"0.3px"}}>
            {T.continue} →
          </button>
        </div>
        <div style={{height:32}}/>
      </div>
    );
  }

  // ── SLIDES ──
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",background:`linear-gradient(150deg,${slide.gradA},${slide.gradB})`,transition:"background 0.45s"}}>
      {/* Top bar */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"52px 24px 0"}}>
        {/* Back to lang select */}
        <button onClick={()=>setStep(step-1)}
          style={{width:36,height:36,borderRadius:12,background:"rgba(255,255,255,0.15)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><line x1="19" y1="12" x2="5" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><polyline points="12 19 5 12 12 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        {/* Step dots top */}
        <div style={{display:"flex",gap:6}}>
          {OB_SLIDES.map((_,i)=>(
            <div key={i} onClick={()=>setStep(i+1)} style={{height:6,borderRadius:3,cursor:"pointer",transition:"all 0.3s",width:slideIdx===i?22:6,background:slideIdx===i?"white":"rgba(255,255,255,0.35)"}}/>
          ))}
        </div>
        {/* Skip */}
        {!isLast
          ? <button onClick={onFinish} style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:12,padding:"8px 14px",color:"white",fontSize:12,fontWeight:700,cursor:"pointer"}}>{T.skip}</button>
          : <div style={{width:60}}/>
        }
      </div>

      {/* Illustration */}
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px 0"}}>
        <div style={{filter:"drop-shadow(0 16px 40px rgba(0,0,0,0.25))",transition:"opacity 0.3s"}}>
          {slide.illustration}
        </div>
      </div>

      {/* Bottom sheet */}
      <div style={{background:"rgba(0,0,0,0.18)",backdropFilter:"blur(20px)",borderRadius:"28px 28px 0 0",padding:"28px 28px 44px"}}>
        <h2 style={{color:"white",fontSize:23,fontWeight:900,margin:"0 0 10px",textAlign:"center",lineHeight:1.3,letterSpacing:"-0.3px"}}>
          {T[slide.titleKey]}
        </h2>
        <p style={{color:"rgba(255,255,255,0.8)",fontSize:14,margin:"0 0 28px",textAlign:"center",lineHeight:1.65}}>
          {T[slide.subKey]}
        </p>
        {/* Next / Start */}
        <button onClick={isLast?onFinish:()=>setStep(step+1)}
          style={{width:"100%",padding:"16px",borderRadius:18,border:"none",background:"white",color:slide.gradA,fontSize:16,fontWeight:900,cursor:"pointer",boxShadow:"0 4px 24px rgba(0,0,0,0.2)",letterSpacing:"0.2px"}}>
          {isLast ? T.getStarted : T.continue}
        </button>
      </div>
    </div>
  );
}



// ─── TOPIC ICON HELPER ───
function TopicIcon({icon, size=20, color="#94A3B8"}) {
  const map = {
    traffic: IC.Traffic, roadsign: IC.RoadSign, refresh: IC.Refresh,
    walk: IC.Walk, weather: IC.Weather, speed: IC.Speed,
    ambulance: IC.Ambulance, wrench: IC.Wrench,
    mandatory: IC.Mandatory, prohibit: IC.Prohibit, warning: IC.Warning,
    warning2: IC.Warning, info: IC.Info, hospital: IC.Hospital,
    ticket: IC.Ticket2, stats: IC.Stats, graduation: IC.GraduationCap2,
    "⭐": IC.Star, "ℹ️": IC.Info,
  };
  const Comp = map[icon] || IC.Info;
  return <Comp size={size} color={color}/>;
}

// ─── PRO GATE KOMPONENTI ───
function ProGate({T, C, setScreen, reason, onBack}) {
  const reasons = {
    ticket: {
      title: "Bu bilet Pro uchun",
      sub: "Ushbu bilet faqat Pro obuna foydalanuvchilari uchun ochiq.",
      icon: "ticket",
    },
    testLimit: {
      title: "Kunlik limit tugadi",
      sub: `Bugun ${LIMITS.dailyTestLimit} ta bepul test savoliga javob berdingiz. Davom etish uchun Pro obuna oling.`,
      icon: "stats",
    },
    examLimit: {
      title: "Bepul imtihon tugadi",
      sub: `Kuniga ${LIMITS.freeExamCount} ta bepul imtihon. Bugungi imtihon huquqingiz tugadi.`,
      icon: "graduation",
    },
  };
  const r = reasons[reason] || reasons.ticket;
  return (
    <div style={{minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, textAlign:"center"}}>
      <div style={{display:"flex",justifyContent:"center",marginBottom:20}}><TopicIcon icon={r.icon} size={60} color="#8B5CF6"/></div>
      <div style={{width:72, height:72, borderRadius:22, background:"linear-gradient(135deg,#8B5CF6,#6366F1)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", boxShadow:"0 8px 24px rgba(139,92,246,0.4)"}}>
        <IC.Diamond size={34} color="white"/>
      </div>
      <h2 style={{fontSize:22, fontWeight:900, color:C.text, margin:"0 0 10px"}}>{r.title}</h2>
      <p style={{fontSize:14, color:C.subtext, margin:"0 0 32px", lineHeight:1.7, maxWidth:280}}>{r.sub}</p>
      <button onClick={()=>setScreen("pro")} style={{width:"100%", maxWidth:300, padding:"16px", borderRadius:16, border:"none", background:"linear-gradient(135deg,#8B5CF6,#6366F1)", color:"white", fontSize:16, fontWeight:800, cursor:"pointer", boxShadow:"0 6px 20px rgba(139,92,246,0.4)", marginBottom:12}}>
        <span style={{display:"flex",alignItems:"center",gap:8,justifyContent:"center"}}><IC.Diamond size={18} color="white"/>Pro obuna olish</span>
      </button>
      <button onClick={onBack} style={{width:"100%", maxWidth:300, padding:"14px", borderRadius:14, border:`2px solid ${C.gray200}`, background:"transparent", color:C.subtext, fontSize:14, fontWeight:600, cursor:"pointer"}}>
        Orqaga qaytish
      </button>
    </div>
  );
}

function HomeScreen({setScreen,user,T,C,unreadCount,savedQuestions,dark,setDark,lang,setLang}) {
  const [showLang,setShowLang]=useState(false);
  const [searchQuery,setSearchQuery]=useState("");

  const menuItems=[
    {lk:"tickets",  Icon:IC.Ticket,        sc:"tickets",  accent:"#1A6BFF", light:"#EBF2FF"},
    {lk:"tests",    Icon:IC.Clipboard,     sc:"tests",    accent:"#8B5CF6", light:"#F5F3FF"},
    {lk:"exam",     Icon:IC.GraduationCap, sc:"exam",     accent:"#F59E0B", light:"#FEF3C7"},
    {lk:"duel",     Icon:NavIcons.Duel,    sc:"duel",     accent:"#1A6BFF", light:"#EBF2FF"},
    {lk:"topics",   Icon:IC.Map,           sc:"topics",   accent:"#22C55E", light:"#DCFCE7"},
    {lk:"rules",    Icon:IC.Shield,        sc:"rules",    accent:"#EC4899", light:"#FCE7F3"},
    {lk:"stats",    Icon:IC.BarChart,      sc:"stats",    accent:"#8B5CF6", light:"#F5F3FF"},
    {lk:"pro",      Icon:IC.Diamond,       sc:"pro",      accent:"#F59E0B", light:"#FEF3C7"},
  ];

  const activities=[
    {Icon:IC.Ticket,    label:T.actBilet+" 12", score:"18/20", p:90,  color:"#1A6BFF"},
    {Icon:IC.Clipboard, label:T.actTest,         score:"19/25", p:76,  color:"#8B5CF6"},
    {Icon:IC.Clock,     label:T.actExam,         score:"18/20", p:90,  color:"#22C55E"},
  ];

  return (
    <div style={{minHeight:"100vh",background:C.bg,paddingBottom:24}} onClick={()=>showLang&&setShowLang(false)}>

      {/* ── TOP BAR ── */}
      <div style={{padding:"52px 20px 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>

        {/* Lang dropdown trigger */}
        <div style={{position:"relative"}} onClick={e=>e.stopPropagation()}>
          <button onClick={()=>setShowLang(!showLang)}
            style={{display:"flex",alignItems:"center",gap:7,padding:"8px 14px",borderRadius:20,border:`1.5px solid ${showLang?C.primary:C.gray200}`,background:showLang?C.primary+"18":C.card,cursor:"pointer",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",transition:"all 0.2s"}}>
            <IC.Globe size={14} color={showLang?C.primary:C.gray400}/>
            <span style={{fontSize:12,fontWeight:700,color:showLang?C.primary:C.subtext}}>{LANGS[lang].label}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{transform:showLang?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.25s"}}>
              <polyline points="6 9 12 15 18 9" stroke={showLang?C.primary:C.gray400} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Dropdown panel */}
          {showLang&&(
            <div style={{
              position:"absolute",top:"calc(100% + 8px)",left:0,
              background:C.card,borderRadius:16,
              boxShadow:`0 8px 32px rgba(0,0,0,${dark?0.4:0.14})`,
              border:`1.5px solid ${C.gray200}`,
              overflow:"hidden",zIndex:200,minWidth:190,
              animation:"dropDown 0.18s ease"
            }}>
              <style>{`@keyframes dropDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
              {Object.values(LANGS).map((l,i)=>{
                const active=lang===l.code;
                return (
                  <div key={l.code} onClick={()=>{setLang(l.code);setShowLang(false);}}
                    style={{
                      display:"flex",alignItems:"center",gap:12,
                      padding:"12px 16px",cursor:"pointer",
                      background:active?C.primary+"15":"transparent",
                      borderBottom:i<Object.values(LANGS).length-1?`1px solid ${C.gray200}`:"none",
                      transition:"background 0.15s"
                    }}>
                    <span style={{flex:1,fontSize:13,fontWeight:active?700:500,color:active?C.primary:C.text}}>{l.label}</span>
                    {active&&(
                      <div style={{width:18,height:18,borderRadius:"50%",background:C.primary,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right actions */}
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {/* Dark toggle */}
          <button onClick={()=>setDark(!dark)}
            style={{display:"flex",alignItems:"center",gap:6,padding:"8px 12px",borderRadius:20,border:`1.5px solid ${C.gray200}`,background:C.card,cursor:"pointer",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
            {dark
              ? <IC.Sun size={15} color="#F59E0B"/>
              : <IC.Moon size={15} color="#8B5CF6"/>
            }
          </button>
          {/* Bell */}
          <button onClick={()=>setScreen("notifications")}
            style={{width:36,height:36,borderRadius:"50%",background:C.card,border:`1.5px solid ${C.gray200}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
            <IC.Bell size={16} color={C.gray600}/>
            {unreadCount>0&&<div style={{position:"absolute",top:-2,right:-2,minWidth:16,height:16,borderRadius:8,background:"#EF4444",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:900,color:"white",padding:"0 3px"}}>{unreadCount>9?"9+":unreadCount}</div>}
          </button>
        </div>
      </div>

      {/* ── HERO GREETING ── */}
      <div style={{padding:"24px 20px 0"}}>

        {/* SEARCH BAR */}
        <div style={{marginTop:20,display:"flex",alignItems:"center",gap:10,background:C.card,borderRadius:16,padding:"12px 16px",border:`1.5px solid ${searchQuery?C.primary:C.gray200}`,boxShadow:"0 1px 6px rgba(0,0,0,0.05)",transition:"border 0.2s"}}>
          <IC.Search size={16} color={searchQuery?C.primary:C.gray400}/>
          <input
            value={searchQuery||""}
            onChange={e=>setSearchQuery(e.target.value)}
            placeholder={T.searchPlaceholder}
            style={{flex:1,border:"none",background:"transparent",fontSize:14,outline:"none",color:C.text}}
          />
          {searchQuery
            ? <button onClick={()=>setSearchQuery("")} style={{background:"none",border:"none",cursor:"pointer",padding:0,display:"flex"}}><IC.XCircle size={16} color={C.gray400}/></button>
            : <IC.Filter size={15} color={C.gray400}/>
          }
        </div>
      </div>

      {/* ── QUICK MENU ── */}
      <div style={{padding:"18px 20px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <span style={{fontWeight:700,fontSize:15,color:C.text}}>Xizmatlar</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10}}>
          {menuItems.map(item=>{
            const bg = dark ? item.accent+"28" : item.light;
            return (
              <div key={item.lk||item.label} onClick={()=>setScreen(item.sc)}
                style={{background:bg,borderRadius:18,padding:"14px 6px",textAlign:"center",cursor:"pointer",position:"relative",transition:"transform 0.15s",border:`1px solid ${item.accent}22`}}>
                <div style={{width:36,height:36,borderRadius:12,background:item.accent+"22",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 6px"}}>
                  <item.Icon size={18} color={item.accent}/>
                </div>
                <div style={{fontSize:10,fontWeight:700,color:C.text}}>{item.lk ? T[item.lk] : item.label}</div>
                {item.lk==="tests"&&savedQuestions.length>0&&(
                  <div style={{position:"absolute",top:6,right:6,minWidth:14,height:14,borderRadius:7,background:"#F59E0B",display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,fontWeight:900,color:"white",padding:"0 2px"}}>{savedQuestions.length}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── STATS + GOAL ── */}
      <div style={{padding:"18px 20px 0"}}>

        {/* STATS STRIP */}
        <div style={{display:"flex",gap:10,marginBottom:14}}>
          {[
            {label:T.active,  val:"92%", color:"#1A6BFF", bg:dark?"#1A3A6B22":"#EBF2FF"},
            {label:T.tests,   val:"85%", color:"#22C55E", bg:dark?"#16653622":"#DCFCE7"},
            {label:T.rating,  val:"#24", color:"#F59E0B", bg:dark?"#78350f22":"#FEF3C7"},
          ].map(s=>(
            <div key={s.label} style={{flex:1,background:s.bg,borderRadius:16,padding:"12px 10px",textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:900,color:s.color}}>{s.val}</div>
              <div style={{fontSize:10,color:C.subtext,marginTop:2,fontWeight:500}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* TODAY GOAL CARD */}
        <div style={{background:dark?"linear-gradient(135deg,#1e3a5f,#1e2d5a)":"linear-gradient(135deg,#1A6BFF,#3B82F6)",borderRadius:22,padding:"18px 20px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",right:-20,top:-20,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
          <div style={{position:"absolute",right:30,bottom:-30,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",position:"relative"}}>
            <div>
              <div style={{color:"rgba(255,255,255,0.75)",fontSize:12,fontWeight:500,marginBottom:4}}>{T.todayGoal}</div>
              <div style={{color:"white",fontSize:22,fontWeight:900}}>120 <span style={{fontSize:14,fontWeight:500,opacity:0.7}}>/ 150 {T.questions}</span></div>
            </div>
            <div style={{background:"rgba(255,255,255,0.15)",borderRadius:12,padding:"6px 12px"}}>
              <span style={{color:"white",fontSize:14,fontWeight:800}}>80%</span>
            </div>
          </div>
          <div style={{marginTop:14,height:6,background:"rgba(255,255,255,0.2)",borderRadius:100}}>
            <div style={{height:"100%",width:"80%",background:"white",borderRadius:100,boxShadow:"0 0 8px rgba(255,255,255,0.5)"}}/>
          </div>
        </div>
      </div>

      {/* ── RECENT ACTIVITY ── */}
      <div style={{padding:"20px 20px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <span style={{fontWeight:700,fontSize:15,color:C.text}}>{T.lastActivity}</span>
          <span onClick={()=>setScreen("tickets")} style={{fontSize:12,color:C.primary,fontWeight:600,cursor:"pointer"}}>{T.allBtn}</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {activities.map((a,i)=>(
            <div key={i} style={{background:C.card,borderRadius:16,padding:"13px 16px",display:"flex",alignItems:"center",gap:12,border:`1px solid ${C.cardBorder}`,boxShadow:"0 1px 6px rgba(0,0,0,0.05)"}}>
              <div style={{width:38,height:38,borderRadius:12,background:a.color+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <a.Icon size={18} color={a.color}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:13,color:C.text}}>{a.label}</div>
                <div style={{fontSize:11,color:C.subtext,marginTop:1}}>{a.score}</div>
              </div>
              <div style={{background:a.p>=80?C.success+"18":C.warning+"18",borderRadius:20,padding:"4px 10px"}}>
                <span style={{fontSize:12,fontWeight:800,color:a.p>=80?C.success:C.warning}}>{a.p}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TicketsScreen({setScreen,setActiveTicket,T,C,user}) {
  const [tab,setTab]=useState("all");
  const isPro = user?.pro || false;
  const pm=[95,90,80,100,75,null,null,null,null,null,88,null,null,null,null,null,null,null,null,null];
  const list=tickets.slice(0,20).map((t,i)=>({...t,progress:pm[i]}));
  const filtered=list.filter(t=>tab==="all"?true:tab==="done"?t.progress!==null:t.progress===null);

  const handleTicketClick = (ticket) => {
    if(ticket.isPro && !isPro) {
      setActiveTicket(ticket);
      setScreen("ticket-pro-gate");
      return;
    }
    setActiveTicket(ticket);
    setScreen("ticket-quiz");
  };

  return (
    <div>
      <div style={SC.header(C)}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><h2 style={{color:"white",fontSize:22,fontWeight:800,margin:0}}>{T.tickets}</h2><p style={{color:"rgba(255,255,255,0.7)",fontSize:13,margin:0}}>{T.allTickets}</p></div>
          {isPro && <div style={{background:"rgba(255,255,255,0.2)",borderRadius:20,padding:"5px 12px",display:"flex",alignItems:"center",gap:5}}><IC.Diamond size={14} color="white"/><span style={{color:"white",fontSize:12,fontWeight:700}}>PRO</span></div>}
        </div>
        <div style={{display:"flex",gap:8,marginTop:16}}>
          {[["all",T.allTab],["done",T.done],["undone",T.undone]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{padding:"7px 14px",borderRadius:20,border:"none",cursor:"pointer",background:tab===id?"white":"rgba(255,255,255,0.2)",color:tab===id?C.primary:"white",fontSize:13,fontWeight:600}}>{label}</button>
          ))}
        </div>
      </div>
      <div style={{padding:16}}>
        {/* Bepul/Pro info */}
        {!isPro && <div style={{background:C.card,borderRadius:12,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:10,border:`1px solid ${C.cardBorder}`}}>
          <IC.Info size={16} color={C.primary}/>
          <span style={{fontSize:12,color:C.subtext,flex:1}}>Biletlar 1-{LIMITS.freeTicketCount} bepul. {LIMITS.freeTicketCount+1}-100 Pro uchun <IC.Diamond size={12} color="#8B5CF6"/></span>
        </div>}
        {filtered.map(ticket=>{
          const isLocked = ticket.isPro && !isPro;
          return (
            <div key={ticket.id} onClick={()=>handleTicketClick(ticket)}
              style={{background:C.card,borderRadius:14,padding:"14px 16px",marginBottom:10,display:"flex",alignItems:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.08)",cursor:"pointer",border:`1px solid ${isLocked?"#E2E8F0":C.cardBorder}`,opacity:isLocked?0.8:1}}>
              <div style={{width:40,height:40,borderRadius:12,background:isLocked?"#F1F5F9":ticket.progress!==null?C.primary+"22":C.gray100,display:"flex",alignItems:"center",justifyContent:"center",marginRight:12,fontWeight:700,color:isLocked?C.muted:ticket.progress!==null?C.primary:C.gray600,fontSize:13}}>
                {isLocked ? <IC.Lock size={18} color={C.muted}/> : `B${ticket.id}`}
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:14,color:isLocked?C.subtext:C.text,display:"flex",alignItems:"center",gap:6}}>
                  {T.ticket} {ticket.id}
                  {ticket.isPro && <span style={{fontSize:9,fontWeight:800,background:"linear-gradient(135deg,#8B5CF6,#6366F1)",color:"white",borderRadius:6,padding:"2px 6px"}}>PRO</span>}
                </div>
                <div style={{fontSize:12,color:C.subtext}}>20 {T.questions}</div>
              </div>
              {!isLocked && ticket.progress!==null
                ? <CircleProgress percent={ticket.progress} size={44} color={ticket.progress>=80?C.success:C.warning}/>
                : isLocked
                  ? <IC.Diamond size={18} color="#8B5CF6"/>
                  : <div style={{width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center"}}><IC.ChevronRight size={16} color={C.muted}/></div>
              }
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OptionsList({options,correct,selected,onSelect,C}) {
  return <>{options.map((opt,i)=>{
    const letter=String.fromCharCode(65+i),isSel=selected===i,isCorr=i===correct;
    let bg=C.gray100,border="transparent",color=C.text;
    if(selected!==null){if(isCorr){bg="#DCFCE7";border=C.success;color=C.success;}else if(isSel){bg="#FEE2E2";border=C.danger;color=C.danger;}}
    return <div key={i} onClick={()=>selected===null&&onSelect(i)} style={{background:bg,borderRadius:14,padding:"14px 16px",marginBottom:10,border:`2px solid ${border}`,cursor:selected!==null?"default":"pointer",display:"flex",alignItems:"center",gap:12}}>
      <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,background:selected!==null&&isCorr?C.success:selected!==null&&isSel?C.danger:C.card,border:`2px solid ${C.gray300}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:selected!==null&&(isCorr||isSel)?"white":C.gray600}}>{letter}</div>
      <span style={{fontWeight:500,fontSize:14,color}}>{opt}</span>
    </div>;
  })}</>;
}

function TicketQuizScreen({setScreen,ticket,setLastResult,T,C,lang,savedQuestions,setSavedQuestions,addToast,token}) {
  const [current,setCurrent]=useState(0);
  const [answers,setAnswers]=useState({});
  const [selected,setSelected]=useState(null);
  const [answered,setAnswered]=useState(false);
  if(!ticket){setScreen("tickets");return null;}
  const q=ticket.questions[current],total=ticket.questions.length;

  const qKey = `${ticket.id}-${q.id}`;
  const isSaved = savedQuestions.some(s=>s.key===qKey);

  const toggleBookmark = () => {
    if(isSaved){
      setSavedQuestions(savedQuestions.filter(s=>s.key!==qKey));
      addToast(T.bookmarkRemoved,"info");
    } else {
      setSavedQuestions([...savedQuestions,{
        key:qKey, ticketId:ticket.id, questionId:q.id,
        question:q.question, sign:q.sign, options:q.options, correct:q.correct,
        savedAt:Date.now()
      }]);
      addToast(T.bookmarkAdded,"success");
    }
  };

  const handleAnswer=(optIdx)=>{
    if(answered) return;
    setSelected(optIdx);
    setAnswered(true);
    setAnswers({...answers,[current]:optIdx});
    // Kunlik hisoblagichni oshirish (faqat birinchi marta javob berganda)
    incDailyCount('tests');
  };

  const goNext=()=>{
    if(current+1<total){setCurrent(current+1);setSelected(answers[current+1]??null);setAnswered(answers[current+1]!==undefined);}
    else{const na={...answers};const c=Object.values(na).filter((v,i)=>v===ticket.questions[i]?.correct).length;setLastResult({ticket,correct:c,total,wrong:total-c});submitTestResult("ticket",ticket.questions,na,token);setScreen("ticket-result");}
  };

  const goBack=()=>{
    if(current>0){setCurrent(current-1);setSelected(answers[current-1]??null);setAnswered(answers[current-1]!==undefined);}
  };

  const explanation = q.explanation;

  return <div style={{minHeight:"100vh",background:C.white,paddingBottom:90}}>
    <div style={{...SC.header(C),padding:"50px 20px 20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <button onClick={()=>setScreen("tickets")} style={{background:"rgba(255,255,255,0.2)",border:"none",width:36,height:36,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><IC.ArrowLeft size={18} color="white"/></button>
        <div style={{color:"white",fontWeight:700,fontSize:16}}>{T.ticket} {ticket.id}</div>
        <button onClick={toggleBookmark} style={{width:36,height:36,background:isSaved?"rgba(255,215,0,0.3)":"rgba(255,255,255,0.2)",borderRadius:10,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"background 0.2s"}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved?"#FFD700":"none"} stroke={isSaved?"#FFD700":"white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>
      <div style={{color:"rgba(255,255,255,0.8)",fontSize:13,marginBottom:8}}>{T.questionOf} {current+1} / {total}</div>
      <div style={{display:"flex",gap:3}}>{Array.from({length:total}).map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:100,background:answers[i]!==undefined?"white":i===current?"rgba(255,255,255,0.7)":"rgba(255,255,255,0.25)"}}/>)}</div>
    </div>
    <div style={{padding:20}}>
      <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:20,lineHeight:1.5}}>{getQ(q.question,lang)}</div>
      {q.image&&<div style={{marginBottom:20}}><img src={q.image} alt="" style={{width:"100%",maxHeight:220,objectFit:"contain",borderRadius:16,background:C.gray100}}/></div>}
      {getSignType(q.sign)&&<div style={{textAlign:"center",marginBottom:20,background:"linear-gradient(135deg,#FEF3C7,#FDE68A)",borderRadius:20,padding:20}}><SignSVG type={getSignType(q.sign)}/></div>}
      <OptionsList options={getOpts(q.options,lang)} correct={q.correct} selected={selected} onSelect={handleAnswer} C={C}/>
      {answered&&(
        <div style={{marginTop:16,borderRadius:14,padding:"14px 16px",
          background:selected===q.correct?`${C.success}10`:`${C.danger}10`,
          borderLeft:`4px solid ${selected===q.correct?C.success:C.danger}`}}>
          {/* To'g'ri/noto'g'ri banner */}
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:explanation?10:0}}>
            {selected===q.correct
              ? <IC.CheckCircle size={16} color={C.success}/>
              : <IC.XCircle size={16} color={C.danger}/>}
            <span style={{fontSize:13,fontWeight:700,color:selected===q.correct?C.success:C.danger}}>
              {selected===q.correct?(T.correct||"To'g'ri!"):(T.wrong||"Noto'g'ri!")}
            </span>
            {selected!==q.correct&&(
              <span style={{fontSize:12,color:C.subtext,marginLeft:"auto"}}>
                {T.correct||"To'g'ri"}: {String.fromCharCode(65+q.correct)}
              </span>
            )}
          </div>
          {/* Izoh qismi */}
          <div style={{borderTop:explanation?`1px solid ${selected===q.correct?C.success+"30":C.danger+"30"}`:"none",
            paddingTop:explanation?10:0}}>
            {explanation?(
              <>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                  <IC.Info size={13} color={C.primary}/>
                  <span style={{fontSize:11,fontWeight:700,color:C.primary,textTransform:"uppercase",letterSpacing:"0.5px"}}>
                    {T.explanationTitle||"Izoh"}
                  </span>
                </div>
                <p style={{margin:0,fontSize:13,color:C.text,lineHeight:1.6}}>
                  {typeof explanation==="object"?(explanation[lang]||explanation.uz):explanation}
                </p>
              </>
            ):(
              <p style={{margin:0,fontSize:12,color:C.subtext,fontStyle:"italic"}}>
                {T.noExplanation||"Bu savol uchun izoh qo'shilmagan."}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
    {/* Fixed bottom nav */}
    <div style={{position:"fixed",bottom:70,left:16,right:16,width:"calc(100% - 32px)",display:"flex",gap:12,padding:"0 0 8px",zIndex:50}}>
      <button onClick={goBack} disabled={current===0} style={{flex:1,padding:"14px",borderRadius:14,border:`2px solid ${current===0?C.gray200:C.primary}`,background:C.card,color:current===0?C.gray400:C.primary,fontSize:14,fontWeight:700,cursor:current===0?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,opacity:current===0?0.5:1}}>
        <IC.ArrowLeft size={16} color={current===0?C.gray400:C.primary}/>{T.back}
      </button>
      <button onClick={goNext} disabled={!answered} style={{flex:1,padding:"14px",borderRadius:14,border:"none",background:answered?`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`:C.gray200,color:answered?"white":C.gray400,fontSize:14,fontWeight:700,cursor:answered?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
        {current+1===total?(T.finish||"Tugatish"):(T.next)}<IC.ArrowRight size={16} color={answered?"white":C.gray400}/>
      </button>
    </div>
  </div>;
}

function ResultScreen({icon,title,subtitle,correct,wrong,percent,stats,actions,T,C}) {
  return <div style={{minHeight:"100vh",background:C.white,padding:20}}>
    <div style={{textAlign:"center",padding:"40px 0 28px"}}>
      <div style={{width:96,height:96,borderRadius:"50%",margin:"0 auto 16px",background:icon==="pass"?"#DCFCE7":"#FEE2E2",display:"flex",alignItems:"center",justifyContent:"center"}}>
        {icon==="pass"?<IC.CheckCircle size={52} color={C.success}/>:<IC.XCircle size={52} color={C.danger}/>}
      </div>
      <div style={{fontSize:46,fontWeight:900,color:icon==="pass"?C.success:C.danger}}>{percent}%</div>
      <div style={{fontSize:22,fontWeight:800,color:C.text,marginTop:4}}>{title}</div>
      {subtitle&&<div style={{fontSize:14,color:C.subtext,marginTop:4}}>{subtitle}</div>}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:20}}>
      {[{lk:"correct",val:correct,color:C.success,bg:"#DCFCE7",Icon:IC.CheckCircle},{lk:"wrong",val:wrong,color:C.danger,bg:"#FEE2E2",Icon:IC.XCircle},{lk:"result",val:`${percent}%`,color:C.primary,bg:C.primary+"22",Icon:IC.BarChart}].map(s=>(
        <Card key={s.lk} C={C} style={{textAlign:"center",background:s.bg,padding:"14px 8px"}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:4}}><s.Icon size={20} color={s.color}/></div>
          <div style={{fontSize:20,fontWeight:800,color:s.color}}>{s.val}</div>
          <div style={{fontSize:10,color:C.subtext}}>{T[s.lk]}</div>
        </Card>
      ))}
    </div>
    {stats&&<Card C={C} style={{marginBottom:20}}>{stats.map(s=><div key={s.label} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.gray100}`}}><span style={{fontSize:14,color:C.subtext}}>{s.label}</span><span style={{fontSize:14,fontWeight:700,color:s.color||C.text}}>{s.value}</span></div>)}</Card>}
    <div style={{display:"flex",flexDirection:"column",gap:10}}>{actions.map((a,i)=><Btn key={i} C={C} variant={i===0?"primary":"outline"} onClick={a.onClick}>{a.label}</Btn>)}</div>
  </div>;
}

function TicketResultScreen({setScreen,result,T,C}) {
  if(!result){setScreen("tickets");return null;}
  const {correct,total,wrong}=result,percent=Math.round((correct/total)*100);
  return <ResultScreen T={T} C={C} icon={wrong<=2?"pass":"fail"} title={wrong<=2?T.greatResult:T.failed} subtitle={`Bilet ${result.ticket?.id} ${T.ticketDone}`} correct={correct} wrong={wrong} total={total} percent={percent} actions={[{label:T.otherTicket,onClick:()=>setScreen("tickets")},{label:T.goHome,onClick:()=>setScreen("home")}]}/>;
}

function TestsScreen({setScreen,T,C,user}) {
  const isPro = user?.pro || false;
  const usedToday = getDailyCount('tests');
  const remaining = Math.max(0, LIMITS.dailyTestLimit - usedToday);
  const limitReached = !isPro && remaining === 0;
  return <div style={{paddingBottom:80}}>
    <div style={{background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,padding:"52px 20px 24px"}}>
      <h2 style={{color:"white",fontSize:22,fontWeight:800,margin:0}}>{T.tests}</h2>
      <p style={{color:"rgba(255,255,255,0.7)",fontSize:13,margin:"4px 0 0"}}>{T.testsSub}</p>
    </div>
    <div style={{padding:16}}>
      <div style={{background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,borderRadius:20,padding:20,marginBottom:16,display:"flex",alignItems:"center",gap:16}}>
        <div style={{width:56,height:56,background:"rgba(255,255,255,0.2)",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center"}}><IC.Infinity size={28} color="white"/></div>
        <div><div style={{color:"white",fontWeight:800,fontSize:18}}>{T.infiniteTest}</div><div style={{color:"rgba(255,255,255,0.7)",fontSize:13}}>{T.infiniteSub}</div></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
        {[{lk:"currentSeries",val:"12",Icon:IC.Flame,ic:C.danger},{lk:"bestSeries",val:"27",Icon:IC.Star,ic:C.warning}].map(s=>(
          <Card key={s.lk} C={C} style={{textAlign:"center"}}><div style={{display:"flex",justifyContent:"center",marginBottom:4}}><s.Icon size={28} color={s.ic}/></div><div style={{fontSize:24,fontWeight:800,color:C.primary}}>{s.val}</div><div style={{fontSize:11,color:C.subtext}}>{T[s.lk]}</div><div style={{fontSize:10,color:C.gray400}}>{T.rightAnswer}</div></Card>
        ))}
      </div>
      {[{lk:"lastResults",Icon:IC.BarChart,ic:C.primary,sc:null},{lk:"byTopic",Icon:IC.BookOpen,ic:C.success,sc:null},{lk:"hardQ",Icon:IC.Bookmark,ic:"#FFD700",sc:"saved"}].map(item=>(
        <Card key={item.lk} C={C} style={{marginBottom:10,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}} onClick={()=>item.sc&&setScreen(item.sc)}>
          <div style={{display:"flex",alignItems:"center",gap:12}}><item.Icon size={20} color={item.ic}/><span style={{fontWeight:600,fontSize:14,color:C.text}}>{item.lk==="hardQ"?T.savedQ:T[item.lk]}</span></div>
          <IC.ChevronRight size={16} color={C.gray400}/>
        </Card>
      ))}
    </div>
    {/* Sticky bottom button */}
    <div style={{position:"fixed",bottom:70,left:16,right:16,width:"calc(100% - 32px)",padding:"0 0 8px",zIndex:50}}>
      {!isPro && limitReached ? (
        <div style={{background:"linear-gradient(135deg,#8B5CF6,#6366F1)",borderRadius:18,padding:"16px 20px",marginBottom:10,textAlign:"center"}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:8}}>
            <IC.Lock size={22} color="white"/>
          </div>
          <div style={{color:"white",fontWeight:800,fontSize:15,marginBottom:4}}>{T.testLimitMsg}</div>
          <div style={{color:"rgba(255,255,255,0.8)",fontSize:12,marginBottom:12}}>{T.testLimitSub}</div>
          <button onClick={()=>setScreen("pro")}
            style={{width:"100%",padding:"13px",borderRadius:14,border:"none",background:"white",color:"#8B5CF6",fontSize:15,fontWeight:800,cursor:"pointer"}}>
            {T.proGetBtn}
          </button>
        </div>
      ) : (
        <button onClick={()=>{ incDailyCount('tests'); setScreen("test-quiz"); }}
          style={{width:"100%",padding:"16px",borderRadius:16,border:"none",background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,color:"white",fontSize:16,fontWeight:800,cursor:"pointer",boxShadow:`0 6px 20px ${C.primary}50`}}>
          {T.startTest}
        </button>
      )}
    </div>
  </div>;
}

function TestQuizScreen({setScreen,setLastTestResult,T,C,lang,savedQuestions,setSavedQuestions,user,token}) {
  const isPro = user?.pro || user?.isPro || false;
  // Bepul foydalanuvchi faqat bepul biletlar savollaridan, Pro hammasidan oladi
  const allQs = tickets
    .filter(t => !t.isPro || isPro)
    .flatMap(t=>t.questions);
  const [questions]=useState(()=>allQs.sort(()=>Math.random()-0.5).slice(0,12));
  const [current,setCurrent]=useState(0);
  const [answers,setAnswers]=useState({});
  const [selected,setSelected]=useState(null);
  const [answered,setAnswered]=useState(false);
  const [timeLeft,setTimeLeft]=useState(600);
  useEffect(()=>{const t=setInterval(()=>setTimeLeft(p=>p>0?p-1:0),1000);return()=>clearInterval(t);},[]);
  const mins=Math.floor(timeLeft/60).toString().padStart(2,"0"),secs=(timeLeft%60).toString().padStart(2,"0"),q=questions[current];
  const qKey=`test-${current}`;
  const isSaved=savedQuestions.some(s=>s.key===qKey);
  const toggleBookmark=()=>{if(isSaved){setSavedQuestions(savedQuestions.filter(s=>s.key!==qKey));}else{setSavedQuestions([...savedQuestions,{key:qKey,question:q?.question,options:q?.options,correct:q?.correct,ticketId:"test"}]);}};
  const handleAnswer=(optIdx)=>{
    if(answered) return;
    setSelected(optIdx);
    setAnswered(true);
    setAnswers({...answers,[current]:optIdx});
  };
  const goNext=()=>{
    if(current+1<questions.length){setCurrent(current+1);setSelected(answers[current+1]??null);setAnswered(answers[current+1]!==undefined);}
    else{const na={...answers};const c=Object.values(na).filter((v,i)=>v===questions[i]?.correct).length;setLastTestResult({correct:c,total:questions.length,wrong:questions.length-c});submitTestResult("test",questions,na,token);setScreen("test-result");}
  };
  const goBack=()=>{if(current>0){setCurrent(current-1);setSelected(answers[current-1]??null);setAnswered(answers[current-1]!==undefined);}};
  const explanation=q?.explanation;
  return <div style={{minHeight:"100vh",background:C.white,paddingBottom:90}}>
    <div style={{...SC.header(C),padding:"50px 20px 20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <button onClick={()=>setScreen("tests")} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:10,width:36,height:36,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><IC.ArrowLeft size={18} color="white"/></button>
        <div style={{textAlign:"center"}}><div style={{color:"rgba(255,255,255,0.7)",fontSize:12}}>{T.question}</div><div style={{color:"white",fontWeight:800,fontSize:18}}>{current+1}/{questions.length}</div></div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button onClick={toggleBookmark} style={{width:36,height:36,background:isSaved?"rgba(255,215,0,0.3)":"rgba(255,255,255,0.2)",borderRadius:10,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><IC.Bookmark size={18} color={isSaved?"#FFD700":"white"}/></button>
          <div style={{background:"rgba(255,255,255,0.2)",borderRadius:12,padding:"8px 14px",display:"flex",alignItems:"center",gap:6}}><IC.Clock size={14} color="white"/><span style={{color:"white",fontWeight:700,fontSize:16}}>{mins}:{secs}</span></div>
        </div>
      </div>
      <div style={{display:"flex",gap:4}}>{questions.map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:100,background:answers[i]!==undefined?"white":i===current?"rgba(255,255,255,0.6)":"rgba(255,255,255,0.2)"}}/>)}</div>
    </div>
    <div style={{padding:20}}>
      <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:20,lineHeight:1.5}}>{getQ(q?.question,lang)}</div>
      <OptionsList options={getOpts(q?.options,lang)} correct={q?.correct||0} selected={selected} onSelect={handleAnswer} C={C}/>
      {answered&&(
        <div style={{marginTop:16,borderRadius:14,padding:"14px 16px",
          background:selected===q.correct?`${C.success}10`:`${C.danger}10`,
          borderLeft:`4px solid ${selected===q.correct?C.success:C.danger}`}}>
          {/* To'g'ri/noto'g'ri banner */}
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:explanation?10:0}}>
            {selected===q.correct
              ? <IC.CheckCircle size={16} color={C.success}/>
              : <IC.XCircle size={16} color={C.danger}/>}
            <span style={{fontSize:13,fontWeight:700,color:selected===q.correct?C.success:C.danger}}>
              {selected===q.correct?(T.correct||"To'g'ri!"):(T.wrong||"Noto'g'ri!")}
            </span>
            {selected!==q.correct&&(
              <span style={{fontSize:12,color:C.subtext,marginLeft:"auto"}}>
                {T.correct||"To'g'ri"}: {String.fromCharCode(65+q.correct)}
              </span>
            )}
          </div>
          {/* Izoh qismi */}
          <div style={{borderTop:explanation?`1px solid ${selected===q.correct?C.success+"30":C.danger+"30"}`:"none",
            paddingTop:explanation?10:0}}>
            {explanation?(
              <>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                  <IC.Info size={13} color={C.primary}/>
                  <span style={{fontSize:11,fontWeight:700,color:C.primary,textTransform:"uppercase",letterSpacing:"0.5px"}}>
                    {T.explanationTitle||"Izoh"}
                  </span>
                </div>
                <p style={{margin:0,fontSize:13,color:C.text,lineHeight:1.6}}>
                  {typeof explanation==="object"?(explanation[lang]||explanation.uz):explanation}
                </p>
              </>
            ):(
              <p style={{margin:0,fontSize:12,color:C.subtext,fontStyle:"italic"}}>
                {T.noExplanation||"Bu savol uchun izoh qo'shilmagan."}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
    <div style={{position:"fixed",bottom:70,left:16,right:16,width:"calc(100% - 32px)",display:"flex",gap:12,padding:"0 0 8px",zIndex:50}}>
      <button onClick={goBack} disabled={current===0} style={{flex:1,padding:"14px",borderRadius:14,border:`2px solid ${current===0?C.gray200:C.primary}`,background:C.card,color:current===0?C.gray400:C.primary,fontSize:14,fontWeight:700,cursor:current===0?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,opacity:current===0?0.5:1}}>
        <IC.ArrowLeft size={16} color={current===0?C.gray400:C.primary}/>{T.back}
      </button>
      <button onClick={goNext} disabled={!answered} style={{flex:1,padding:"14px",borderRadius:14,border:"none",background:answered?`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`:C.gray200,color:answered?"white":C.gray400,fontSize:14,fontWeight:700,cursor:answered?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
        {current+1===questions.length?(T.finish||"Tugatish"):T.next}<IC.ArrowRight size={16} color={answered?"white":C.gray400}/>
      </button>
    </div>
  </div>;
}

function ExamScreen({setScreen,T,C,user}) {
  const isPro = user?.pro || false;
  const usedExams = getDailyCount('exams');
  const examRemaining = Math.max(0, LIMITS.freeExamCount - usedExams);
  const examLimitReached = !isPro && examRemaining === 0;
  return <div style={SC.screen(C)}>
    <div style={{...SC.header(C),padding:"52px 20px 32px",textAlign:"center"}}>
      <div style={{display:"flex",justifyContent:"center",marginBottom:12}}><IC.GraduationCap size={56} color="white"/></div>
      <h2 style={{color:"white",fontSize:24,fontWeight:800,margin:0}}>{T.examTitle}</h2>
      <p style={{color:"rgba(255,255,255,0.8)",fontSize:14,margin:"4px 0 0"}}>{T.examReady}</p>
    </div>
    <div style={{padding:20}}>
      <Card C={C} style={{marginBottom:20}}>
        <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:14}}>{T.examRules}</div>
        {[T.rule1,T.rule2,T.rule3,T.rule4].map((r,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:10,alignItems:"flex-start"}}><div style={{width:6,height:6,borderRadius:"50%",background:C.primary,marginTop:6,flexShrink:0}}/><span style={{fontSize:14,color:C.subtext,lineHeight:1.5}}>{r}</span></div>)}
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
        {[{lk:"questionCount",val:"20",Icon:IC.FileText,c:C.primary},{lk:"time",val:"20:00",Icon:IC.Clock,c:C.success},{lk:"errorLimit",val:"2",Icon:IC.AlertTriangle,c:C.danger}].map(s=>(
          <Card key={s.lk} C={C} style={{textAlign:"center",padding:"16px 8px"}}><div style={{display:"flex",justifyContent:"center",marginBottom:6}}><s.Icon size={22} color={s.c}/></div><div style={{fontSize:18,fontWeight:800,color:s.c}}>{s.val}</div><div style={{fontSize:11,color:C.subtext}}>{T[s.lk]}</div></Card>
        ))}
      </div>
    </div>
    {/* Sticky bottom button */}
    <div style={{position:"fixed",bottom:70,left:16,right:16,width:"calc(100% - 32px)",padding:"0 0 8px",zIndex:50}}>
      {!isPro && examLimitReached ? (
        <div style={{background:"linear-gradient(135deg,#8B5CF6,#6366F1)",borderRadius:18,padding:"16px 20px",marginBottom:10,textAlign:"center"}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:8}}>
            <IC.Lock size={22} color="white"/>
          </div>
          <div style={{color:"white",fontWeight:800,fontSize:15,marginBottom:4}}>{T.examLimitMsg}</div>
          <div style={{color:"rgba(255,255,255,0.8)",fontSize:12,marginBottom:12}}>{T.examLimitSub}</div>
          <button onClick={()=>setScreen("pro")}
            style={{width:"100%",padding:"13px",borderRadius:14,border:"none",background:"white",color:"#8B5CF6",fontSize:15,fontWeight:800,cursor:"pointer"}}>
            {T.proGetBtn}
          </button>
        </div>
      ) : (
        <button onClick={()=>{ incDailyCount('exams'); setScreen("exam-quiz"); }}
          style={{width:"100%",padding:"16px",borderRadius:16,border:"none",background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,color:"white",fontSize:16,fontWeight:800,cursor:"pointer",boxShadow:`0 6px 20px ${C.primary}50`}}>
          {T.startExam}
        </button>
      )}
    </div>
  </div>;
}

function ExamQuizScreen({setScreen,setExamResult,T,C,lang,user,token}) {
  const isPro = user?.pro || false;
  // Bepul foydalanuvchi faqat bepul biletlar savollaridan, Pro hammasidan oladi
  const allQs = tickets
    .filter(t => !t.isPro || isPro)
    .flatMap(t=>t.questions);
  const [questions]=useState(()=>allQs.sort(()=>Math.random()-0.5).slice(0,20));
  const [current,setCurrent]=useState(0);const [answers,setAnswers]=useState({});const [selected,setSelected]=useState(null);const [timeLeft,setTimeLeft]=useState(1200);const [wrongCount,setWrongCount]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setTimeLeft(p=>{if(p<=1){const c=Object.values(answers).filter((v,i)=>v===questions[i]?.correct).length;setExamResult({correct:c,total:questions.length,wrong:questions.length-c,passed:(questions.length-c)<=2});submitTestResult("exam",questions,answers,token);setScreen("exam-result");return 0;}return p-1;}),1000);return()=>clearInterval(t);},[]);
  const mins=Math.floor(timeLeft/60).toString().padStart(2,"0"),secs=(timeLeft%60).toString().padStart(2,"0"),q=questions[current];
  const handleAnswer=(optIdx)=>{setSelected(optIdx);const nw=wrongCount+(optIdx!==q.correct?1:0);if(nw>2){const na={...answers,[current]:optIdx};const c=Object.values(na).filter((v,i)=>v===questions[i]?.correct).length;setTimeout(()=>{setExamResult({correct:c,total:questions.length,wrong:nw,passed:false});submitTestResult("exam",questions,na,token);setScreen("exam-fail");},800);return;}setWrongCount(nw);setTimeout(()=>{const na={...answers,[current]:optIdx};setAnswers(na);if(current+1<questions.length){setCurrent(current+1);setSelected(null);}else{const c=Object.values(na).filter((v,i)=>v===questions[i]?.correct).length;const w=questions.length-c;incDailyCount('exams');setExamResult({correct:c,total:questions.length,wrong:w,passed:w<=2,percent:Math.round((c/questions.length)*100)});submitTestResult("exam",questions,na,token);setScreen("exam-result");}},600);};
  return <div style={{minHeight:"100vh",background:C.white}}>
    <div style={{...SC.header(C),padding:"50px 20px 20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{background:"rgba(255,255,255,0.2)",borderRadius:12,padding:"6px 14px"}}><div style={{color:"rgba(255,255,255,0.7)",fontSize:10}}>{T.question}</div><div style={{color:"white",fontWeight:800,fontSize:16}}>{current+1}/{questions.length}</div></div>
        <div style={{background:"rgba(255,255,255,0.2)",borderRadius:12,padding:"6px 14px",display:"flex",alignItems:"center",gap:6}}><IC.Clock size={14} color="white"/><div><div style={{color:"rgba(255,255,255,0.7)",fontSize:10}}>{T.time}</div><div style={{color:"white",fontWeight:800,fontSize:16}}>{mins}:{secs}</div></div></div>
        <div style={{background:wrongCount>0?"rgba(239,68,68,0.3)":"rgba(255,255,255,0.2)",borderRadius:12,padding:"6px 14px",display:"flex",alignItems:"center",gap:6}}><IC.AlertTriangle size={14} color={wrongCount>1?C.danger:"white"}/><div><div style={{color:"rgba(255,255,255,0.7)",fontSize:10}}>{T.errors}</div><div style={{color:wrongCount>1?C.danger:"white",fontWeight:800,fontSize:16}}>{wrongCount}/2</div></div></div>
      </div>
      <div style={{display:"flex",gap:3}}>{questions.map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:100,background:i<current?"white":"rgba(255,255,255,0.3)"}}/>)}</div>
    </div>
    <div style={{padding:20}}>
      <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:20,lineHeight:1.5}}>{getQ(q?.question,lang)}</div>
      {q?.image&&<div style={{marginBottom:20}}><img src={q.image} alt="" style={{width:"100%",maxHeight:200,objectFit:"contain",borderRadius:16,background:C.gray100}}/></div>}
      {getSignType(q?.sign)&&<div style={{textAlign:"center",marginBottom:20,background:"linear-gradient(135deg,#FEF3C7,#FDE68A)",borderRadius:20,padding:16}}><SignSVG type={getSignType(q.sign)}/></div>}
      <OptionsList options={getOpts(q?.options,lang)} correct={q?.correct||0} selected={selected} onSelect={handleAnswer} C={C}/>
    </div>
  </div>;
}

function ExamResultScreen({setScreen,result,T,C}) {
  if(!result){setScreen("exam");return null;}
  const {correct,total,wrong,passed}=result,percent=result.percent??Math.round((correct/total)*100);
  const statsRows=passed?[{label:T.avgResult,value:"87%",color:C.success},{label:T.examCount,value:"8"},{label:T.passedExams,value:"5",color:C.success},{label:T.failedExams,value:"3",color:C.danger}]:null;
  return <ResultScreen T={T} C={C} icon={passed?"pass":"fail"} title={passed?T.congrats:T.examFailed} subtitle={passed?T.examPassed:`${wrong} ${T.tooManyErrors}`} correct={correct} wrong={wrong} total={total} percent={percent} stats={statsRows} actions={passed?[{label:T.goHome,onClick:()=>setScreen("home")}]:[{label:T.retryExam,onClick:()=>setScreen("exam-quiz")},{label:T.goHome,onClick:()=>setScreen("home")}]}/>;
}

function StatsScreen({T,C,lang,setScreen,token}) {
  const graph=[60,70,55,75,80,72,85];
  const months=["01.05","02.05","03.05","04.05","05.05","06.05","07.05"];
  const tabs=[T.general,T.weekly,T.monthly,T.yearly];
  const [tab,setTab]=useState(0);

  // Backenddan haqiqiy statistika (token bo'lsa)
  const [apiStats,setApiStats]=useState(null);
  useEffect(()=>{
    if(!token) return;
    apiGet('/stats', token).then(setApiStats).catch(err=>console.warn('Statistika yuklanmadi:', err));
  },[token]);

  const sCards = apiStats ? [
    {lk:"totalQ",val:String(apiStats.totalQ),c:C.primary,bg:C.primary+"22",Icon:IC.FileText},
    {lk:"correctA",val:String(apiStats.correctA),c:C.success,bg:"#DCFCE7",Icon:IC.CheckCircle},
    {lk:"wrongA",val:String(apiStats.wrongA),c:C.danger,bg:"#FEE2E2",Icon:IC.XCircle},
    {lk:"correctPct",val:`${apiStats.correctPct}%`,c:C.warning,bg:C.warning+"22",Icon:IC.TrendingUp},
  ] : [{lk:"totalQ",val:"2450",c:C.primary,bg:C.primary+"22",Icon:IC.FileText},{lk:"correctA",val:"1980",c:C.success,bg:"#DCFCE7",Icon:IC.CheckCircle},{lk:"wrongA",val:"470",c:C.danger,bg:"#FEE2E2",Icon:IC.XCircle},{lk:"correctPct",val:"81%",c:C.warning,bg:C.warning+"22",Icon:IC.TrendingUp}];

  // ── Mavzular bo'yicha xatolar ──
  // Token mavjud bo'lsa backenddan kelgan haqiqiy ma'lumot, bo'lmasa demo statistika
  const MISTAKE_PCT=[62,48,35,28,20,15,10,8,5,3];
  const topicStats = (apiStats?.mistakesByTopic?.length)
    ? apiStats.mistakesByTopic.map(t=>({ title:t.title[lang]||t.title.uz, color:t.color, pct:t.pct }))
    : TOPICS_DATA.map((t,i)=>({
        title:t.title[lang]||t.title.uz,
        color:t.color,
        pct:MISTAKE_PCT[i%MISTAKE_PCT.length],
      })).sort((a,b)=>b.pct-a.pct).slice(0,5);
  const worst=topicStats[0];

  return <div style={{paddingBottom:16}}>
    <div style={{padding:"52px 20px 20px"}}><h2 style={{fontSize:22,fontWeight:800,color:C.text,margin:0}}>{T.statistics}</h2></div>
    <div style={{padding:"0 16px"}}>
      <div style={{display:"flex",gap:8,marginBottom:16}}>{tabs.map((t,i)=><button key={t} onClick={()=>setTab(i)} style={{padding:"7px 14px",borderRadius:20,border:"none",cursor:"pointer",background:tab===i?C.primary:C.gray200,color:tab===i?"white":C.subtext,fontSize:13,fontWeight:600}}>{t}</button>)}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
        {sCards.map(s=><Card key={s.lk} C={C} style={{background:s.bg,padding:16}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><s.Icon size={18} color={s.c}/></div><div style={{fontSize:24,fontWeight:900,color:s.c}}>{s.val}</div><div style={{fontSize:12,color:C.subtext}}>{T[s.lk]}</div></Card>)}
      </div>

      {/* Reyting */}
      <Card C={C} onClick={()=>setScreen("rating")} style={{marginBottom:20,padding:16,display:"flex",alignItems:"center",gap:12,cursor:"pointer",background:"#FEF9C3"}}>
        <div style={{width:40,height:40,borderRadius:12,background:"#FEF3C7",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <IC.Medal size={20} color="#EAB308"/>
        </div>
        <div style={{flex:1,fontWeight:700,fontSize:14,color:C.text}}>{T.ratingTitle}</div>
        <IC.ChevronRight size={18} color={C.subtext}/>
      </Card>

      {/* Tavsiya bildirishnomasi */}
      {worst&&(
        <div style={{background:"linear-gradient(135deg,#F59E0B22,#EF444422)",border:`1px solid #F59E0B40`,borderRadius:16,padding:14,marginBottom:20,display:"flex",gap:12,alignItems:"flex-start"}}>
          <div style={{width:34,height:34,borderRadius:10,background:"#F59E0B22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <IC.Warning size={18} color="#F59E0B"/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:4}}>{T.statsRecommendTitle}</div>
            <div style={{fontSize:12,color:C.subtext,lineHeight:1.6,marginBottom:10}}>
              {T.statsRecommendBefore} <strong style={{color:C.text}}>«{worst.title}»</strong> {T.statsRecommendAfter.replace("{pct}",worst.pct)}
            </div>
            <button onClick={()=>setScreen("topics")} style={{padding:"8px 16px",borderRadius:10,border:"none",background:"#F59E0B",color:"white",fontSize:12,fontWeight:700,cursor:"pointer"}}>
              {T.statsPracticeBtn}
            </button>
          </div>
        </div>
      )}

      {/* Mavzular bo'yicha xatolar */}
      <Card C={C} style={{marginBottom:20}}>
        <div style={{fontWeight:700,fontSize:15,marginBottom:4,color:C.text,display:"flex",alignItems:"center",gap:8}}><IC.XCircle size={18} color={C.danger}/>{T.statsMistakesTitle}</div>
        <div style={{fontSize:12,color:C.subtext,marginBottom:14}}>{T.statsMistakesSub}</div>
        {topicStats.map(ts=>(
          <div key={ts.title} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:13,fontWeight:600,color:C.text}}>{ts.title}</span>
              <span style={{fontSize:12,fontWeight:800,color:ts.pct>=40?C.danger:ts.pct>=20?C.warning:C.success}}>{ts.pct}% {T.statsMistakePct}</span>
            </div>
            <div style={{height:6,background:C.gray200,borderRadius:100}}>
              <div style={{height:"100%",width:`${ts.pct}%`,background:ts.pct>=40?C.danger:ts.pct>=20?C.warning:C.success,borderRadius:100}}/>
            </div>
          </div>
        ))}
      </Card>

      <Card C={C}>
        <div style={{fontWeight:700,fontSize:15,marginBottom:16,color:C.text,display:"flex",alignItems:"center",gap:8}}><IC.TrendingUp size={18} color={C.primary}/>{T.resultsGraph}</div>
        <svg width="100%" height="120" viewBox="0 0 320 120">
          <defs><linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.primary} stopOpacity="0.25"/><stop offset="100%" stopColor={C.primary} stopOpacity="0"/></linearGradient></defs>
          {[0,25,50,75,100].map(v=><line key={v} x1="0" y1={100-v} x2="320" y2={100-v} stroke={C.gray200} strokeWidth="1" strokeDasharray="4,4"/>)}
          <polyline points={graph.map((v,i)=>`${i*53},${110-v}`).join(" ")} fill="none" stroke={C.primary} strokeWidth="2.5" strokeLinejoin="round"/>
          <polygon points={`0,110 ${graph.map((v,i)=>`${i*53},${110-v}`).join(" ")} ${6*53},110`} fill="url(#gg)"/>
          {graph.map((v,i)=><circle key={i} cx={i*53} cy={110-v} r="5" fill={C.primary} stroke={C.card} strokeWidth="2"/>)}
        </svg>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>{months.map(m=><span key={m} style={{fontSize:10,color:C.gray400}}>{m}</span>)}</div>
      </Card>
    </div>
  </div>;
}

function RatingScreen({T,C,token}) {
  const [tab,setTab]=useState(1);const gold=["#C0C0C0","#FFD700","#CD7F32"];const po=[0,1,2];const hs=[85,110,70];

  const PERIODS = ["daily","weekly","monthly","all"];
  const [apiBoard,setApiBoard]=useState(null);
  useEffect(()=>{
    if(!token) return;
    apiGet(`/leaderboard?period=${PERIODS[tab]}`, token).then(setApiBoard).catch(err=>console.warn('Reyting yuklanmadi:', err));
  },[token,tab]);

  // Backenddan kelgan ro'yxat (agar bo'lsa), aks holda demo ro'yxat
  const board = apiBoard?.leaderboard?.length ? apiBoard.leaderboard : leaderboard.map((u,i)=>({...u}));
  // Joriy foydalanuvchi top20'da bo'lmasa ham, ro'yxat oxirida ko'rsatamiz
  const fullBoard = (apiBoard && apiBoard.me && !board.some(u=>u.me))
    ? [...board, apiBoard.me]
    : board;

  return <div style={{paddingBottom:16}}>
    <div style={{padding:"52px 20px 16px"}}><h2 style={{fontSize:22,fontWeight:800,color:C.text,margin:0,display:"flex",alignItems:"center",gap:8}}><IC.Medal size={24} color={C.warning}/>{T.ratingTitle}</h2></div>
    <div style={{padding:"0 16px"}}>
      <div style={{display:"flex",gap:8,marginBottom:20}}>{[T.daily,T.weekly,T.monthly,T.allTab].map((t,i)=><button key={t} onClick={()=>setTab(i)} style={{padding:"7px 14px",borderRadius:20,border:"none",cursor:"pointer",background:tab===i?C.primary:C.gray200,color:tab===i?"white":C.subtext,fontSize:13,fontWeight:600}}>{t}</button>)}</div>
      {fullBoard.length===0 ? (
        <div style={{textAlign:"center",padding:"40px 20px",color:C.subtext}}>
          <div style={{fontWeight:700,fontSize:15,color:C.text,marginBottom:6}}>{T.ratingEmpty||"Hali natijalar yo'q"}</div>
        </div>
      ) : <>
      <div style={{display:"flex",justifyContent:"center",alignItems:"flex-end",gap:10,marginBottom:24}}>
        {po.map((pi,i)=>{const u=fullBoard[pi]; if(!u) return <div key={i} style={{flex:1}}/>; return <div key={i} style={{textAlign:"center",flex:1}}>
          <div style={{width:52,height:52,borderRadius:"50%",background:u.me?`linear-gradient(135deg,${C.primary},#5B9FFF)`:`linear-gradient(135deg,${gold[i]},rgba(255,255,255,0.5))`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 6px",fontWeight:800,fontSize:18,color:"white",boxShadow:u.me?`0 4px 16px ${C.primary}66`:"0 2px 8px rgba(0,0,0,0.1)"}}>{u.av}</div>
          <div style={{fontSize:13,fontWeight:700,color:C.text}}>{u.name}</div>
          <div style={{fontSize:12,color:C.primary,fontWeight:600}}>{u.xp} xp</div>
          <div style={{height:hs[i],background:gold[i],borderRadius:"10px 10px 0 0",marginTop:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:900,color:"white"}}>{pi+1}</div>
        </div>;})}
      </div>
      {fullBoard.slice(3).map((u,i)=><Card key={u.userId||u.rank||i} C={C} style={{marginBottom:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:12,...(u.me?{border:`2px solid ${C.primary}`}:{})}}>
        <div style={{fontSize:16,fontWeight:700,color:C.gray400,width:24,textAlign:"center"}}>{u.rank||i+4}</div>
        <div style={{width:40,height:40,borderRadius:"50%",background:u.me?`linear-gradient(135deg,${C.primary},#5B9FFF)`:C.gray200,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:u.me?"white":C.gray600}}>{u.av}</div>
        <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14,color:C.text}}>{u.name}</div></div>
        <div style={{fontWeight:700,color:C.primary}}>{u.xp} xp</div>
      </Card>)}
      </>}
    </div>
  </div>;
}



// ─── ABOUT SCREEN ───
function AboutScreen({setScreen, T, C, lang}) {
  return (
    <div style={{minHeight:"100vh", background:C.bg, paddingBottom:80}}>
      <div style={{background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`, padding:"52px 20px 32px", position:"relative", overflow:"hidden", textAlign:"center"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
        <button onClick={()=>setScreen("profile")} style={{background:"rgba(255,255,255,0.15)",border:"none",width:36,height:36,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20,position:"relative"}}>
          <IC.ArrowLeft size={18} color="white"/>
        </button>
        <div style={{width:76,height:76,borderRadius:22,background:"rgba(255,255,255,0.18)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",boxShadow:"0 8px 24px rgba(0,0,0,0.2)"}}>
          <span style={{color:"white",fontSize:38,fontWeight:900,fontFamily:"serif"}}>N</span>
        </div>
        <h2 style={{color:"white",fontSize:24,fontWeight:900,margin:"0 0 6px"}}>Nazariy</h2>
        <p style={{color:"rgba(255,255,255,0.7)",fontSize:13,margin:"0 0 4px"}}>Avtotest Ilovasi</p>
        <p style={{color:"rgba(255,255,255,0.5)",fontSize:12,margin:0}}>v{APP_CONFIG.version}</p>
      </div>

      <div style={{padding:"20px 16px"}}>
        {/* Biz haqimizda */}
        <div style={{background:C.card,borderRadius:16,padding:18,marginBottom:14,border:`1px solid ${C.cardBorder}`}}>
          <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
            <IC.Info size={16} color={C.primary}/> {T.about}
          </div>
          <p style={{margin:0,fontSize:13,color:C.subtext,lineHeight:1.7}}>
            {typeof APP_CONFIG.aboutText === "object"
              ? (APP_CONFIG.aboutText[lang] || APP_CONFIG.aboutText.uz)
              : APP_CONFIG.aboutText}
          </p>
        </div>

        {/* Aloqa */}
        <div style={{background:C.card,borderRadius:16,padding:18,marginBottom:14,border:`1px solid ${C.cardBorder}`}}>
          <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
            <IC.Headphones size={16} color="#22C55E"/> {T.support}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",background:C.bg,borderRadius:12,cursor:"pointer"}}
            onClick={()=>{
              const url=`https://t.me/${APP_CONFIG.supportUsername}`;
              if(window.Telegram?.WebApp?.openTelegramLink) window.Telegram.WebApp.openTelegramLink(url);
              else window.open(url,'_blank');
            }}>
            <div style={{width:38,height:38,borderRadius:10,background:"#DCFCE7",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <IC.Headphones size={18} color="#22C55E"/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:13,color:C.text}}>{T.tgSupport}</div>
              <div style={{fontSize:12,color:"#22C55E",marginTop:1}}>@{APP_CONFIG.supportUsername}</div>
            </div>
            <IC.ChevronRight size={16} color={C.muted}/>
          </div>
        </div>

        {/* Yangiliklar kanali */}
        <div style={{background:C.card,borderRadius:16,padding:18,marginBottom:14,border:`1px solid ${C.cardBorder}`}}>
          <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
            <IC.Bell size={16} color={C.primary}/> {T.news || "Yangiliklar"}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",background:C.bg,borderRadius:12,cursor:"pointer"}}
            onClick={()=>{
              const url=`https://t.me/${APP_CONFIG.newsChannel}`;
              if(window.Telegram?.WebApp?.openTelegramLink) window.Telegram.WebApp.openTelegramLink(url);
              else window.open(url,'_blank');
            }}>
            <div style={{width:38,height:38,borderRadius:10,background:C.primary+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <IC.Bell size={18} color={C.primary}/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:13,color:C.text}}>{T.tgChannel}</div>
              <div style={{fontSize:12,color:C.primary,marginTop:1}}>@{APP_CONFIG.newsChannel}</div>
            </div>
            <IC.ChevronRight size={16} color={C.muted}/>
          </div>
        </div>

        {/* Versiya va huquq */}
        <div style={{textAlign:"center",padding:"12px 0",color:C.muted,fontSize:12}}>
          <div style={{marginBottom:4}}>Nazariy v{APP_CONFIG.version}</div>
          <div>© 2025 Nazariy Avtotest. Barcha huquqlar himoyalangan.</div>
        </div>
      </div>
    </div>
  );
}

// ─── DUEL SCREEN ───
function DuelScreen({setScreen, T, C, user, addToast, token, setActiveDuel}) {
  const [activeTab, setActiveTab] = useState("active");
  const [showInviteModal, setShowInviteModal] = useState(false);

  const [duels, setDuels] = useState([]);
  const loadDuels = () => {
    if(!token) return;
    apiGet('/duel', token).then(setDuels).catch(err=>console.warn('Duellar yuklanmadi:', err));
  };
  useEffect(loadDuels, [token]);

  const formatTime = (h) => {
    if(h < 1)    return T.justNow;
    if(h < 24)   return `${h} ${T.hoursAgo}`;
    if(h === 24) return T.yesterday;
    return `${Math.floor(h/24)} ${T.daysAgo}`;
  };

  const activeDuels  = duels.filter(d => d.status !== "done");
  const historyDuels = duels.filter(d => d.status === "done");

  const startDuel = (d) => {
    setActiveDuel(d.id);
    setScreen("duel-quiz");
  };

  const inviteDuel = async () => {
    let duelId = null;
    if(token){
      try{
        const res = await apiPost('/duel', {}, token);
        duelId = res.id;
      } catch(err){ console.error(err); addToast?.("Xatolik yuz berdi","error"); return; }
    }
    const botLink = duelId
      ? `https://t.me/${APP_CONFIG.botUsername}?start=duel_${duelId}`
      : `https://t.me/${APP_CONFIG.botUsername}?start=duel_${user?.tgId||"me"}_${Date.now()}`;
    const txt = `${T.duelInvite}! Nazariy testida kuchimizni sinab ko'raylik: ${botLink}`;
    if (window.Telegram?.WebApp?.switchInlineQuery) {
      window.Telegram.WebApp.switchInlineQuery(txt, ["users","groups"]);
    } else {
      try { navigator.clipboard.writeText(botLink); } catch {}
      addToast("Havola nusxalandi!", "success");
    }
    setShowInviteModal(false);
    loadDuels();
  };

  const statusLabel = (s) => {
    if(s==="waiting")   return {text:T.duelWaiting?.split(" ")[0]||"Kutilmoqda", bg:"#FEF3C7", color:"#92400E"};
    if(s==="your_turn") return {text:T.duelYourTurn||"Navbatingiz", bg:"#DCFCE7", color:"#166534"};
    return {text:"Tugadi", bg:"#F1F5F9", color:"#64748B"};
  };

  // VS SVG icon — ikkita odam va "VS" yozuvi
  const VsIcon = ({size=100}) => (
    <svg width={size} height={size*0.75} viewBox="0 0 120 90">
      {/* Left person */}
      <circle cx="24" cy="22" r="12" fill={C.primary}/>
      <path d="M8 58c0-8.8 7.2-16 16-16s16 7.2 16 16" fill={C.primary}/>
      {/* Left person face */}
      <circle cx="21" cy="20" r="1.5" fill="white"/>
      <circle cx="27" cy="20" r="1.5" fill="white"/>
      <path d="M21 25 q3 3 6 0" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {/* Right person */}
      <circle cx="96" cy="22" r="12" fill="#8B5CF6"/>
      <path d="M80 58c0-8.8 7.2-16 16-16s16 7.2 16 16" fill="#8B5CF6"/>
      {/* Right person face */}
      <circle cx="93" cy="20" r="1.5" fill="white"/>
      <circle cx="99" cy="20" r="1.5" fill="white"/>
      <path d="M93 25 q3 3 6 0" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {/* Lightning bolt between them */}
      <polygon points="55,18 48,42 57,42 45,72 72,38 62,38 74,18" fill="#F59E0B" opacity="0.9"/>
      {/* VS text */}
      <text x="60" y="85" textAnchor="middle" fontSize="11" fontWeight="900" fill={C.subtext} letterSpacing="2">VS</text>
    </svg>
  );

  const InviteModal = () => (
    <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={()=>setShowInviteModal(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)"}}/>
      <div style={{position:"relative",width:"100%",background:C.card,borderRadius:"24px 24px 0 0",padding:"24px 20px 40px",zIndex:1}}>
        <div style={{width:40,height:4,borderRadius:2,background:C.gray300,margin:"0 auto 20px"}}/>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
            <VsIcon size={110}/>
          </div>
          <div style={{fontWeight:800,fontSize:18,color:C.text,marginBottom:6}}>{T.duelInviteTitle}</div>
          <div style={{fontSize:13,color:C.subtext,lineHeight:1.5}}>{T.duelInviteDesc}</div>
        </div>
        {[
          [T.duelRule1, T.duelRule1Sub],
          [T.duelRule2, T.duelRule2Sub],
          [T.duelRule3, T.duelRule3Sub],
        ].map(([title, sub], i) => (
          <div key={i} style={{display:"flex",gap:12,marginBottom:12,alignItems:"flex-start"}}>
            <div style={{width:30,height:30,borderRadius:10,background:C.primary+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke={C.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div><div style={{fontWeight:700,fontSize:13,color:C.text}}>{title}</div><div style={{fontSize:12,color:C.subtext}}>{sub}</div></div>
          </div>
        ))}
        <button onClick={inviteDuel}
          style={{width:"100%",padding:"15px",borderRadius:16,border:"none",background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,color:"white",fontSize:15,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginTop:12}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><path d="M22 2L15 22l-4-9-9-4 20-7z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {T.duelSend}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh", background:C.bg, paddingBottom:90}}>
      {showInviteModal && <InviteModal/>}

      {/* Header */}
      <div style={{background:`linear-gradient(135deg,#1A6BFF,#6366F1)`, padding:"52px 20px 28px", position:"relative", overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
        <div style={{position:"absolute",bottom:-20,left:-20,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
        <div style={{position:"relative"}}>
          {/* VS header illustration */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:14}}>
            {/* Me avatar */}
            <div style={{textAlign:"center"}}>
              <div style={{width:52,height:52,borderRadius:16,background:"rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:22,color:"white",margin:"0 auto 4px"}}>
                {(user?.name||"S")[0]}
              </div>
              <div style={{color:"rgba(255,255,255,0.7)",fontSize:10,fontWeight:600}}>{T.duelMe}</div>
            </div>
            {/* VS SVG */}
            <svg width="56" height="48" viewBox="0 0 56 48">
              <polygon points="28,4 22,24 29,24 18,44 42,22 34,22 40,4" fill="#F59E0B"/>
              <text x="28" y="46" textAnchor="middle" fontSize="9" fontWeight="900" fill="white" letterSpacing="1">VS</text>
            </svg>
            {/* Opponent avatar */}
            <div style={{textAlign:"center"}}>
              <div style={{width:52,height:52,borderRadius:16,background:"rgba(139,92,246,0.4)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 4px"}}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="white" strokeWidth="2"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              <div style={{color:"rgba(255,255,255,0.7)",fontSize:10,fontWeight:600}}>{T.duelOpponent}</div>
            </div>
          </div>
          <h2 style={{color:"white",fontSize:22,fontWeight:900,margin:"0 0 4px",textAlign:"center"}}>{T.duelTitle}</h2>
          <p style={{color:"rgba(255,255,255,0.8)",fontSize:13,margin:0,textAlign:"center"}}>{T.duelDesc}</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:8,padding:"16px 16px 0"}}>
        {[[`active`,T.duelActive],[`history`,T.duelHistory]].map(([id,label])=>(
          <button key={id} onClick={()=>setActiveTab(id)}
            style={{padding:"8px 18px",borderRadius:20,border:activeTab===id?"none":`1px solid ${C.gray200}`,cursor:"pointer",background:activeTab===id?C.primary:"transparent",color:activeTab===id?"white":C.subtext,fontSize:13,fontWeight:600}}>
            {label}
          </button>
        ))}
      </div>

      <div style={{padding:"12px 16px"}}>
        {activeTab === "active" ? (
          activeDuels.length === 0 ? (
            <div style={{textAlign:"center",padding:"40px 20px",color:C.subtext}}>
              <div style={{display:"flex",justifyContent:"center",marginBottom:12,opacity:0.3}}>
                <VsIcon size={90}/>
              </div>
              <div style={{fontWeight:700,fontSize:15,color:C.text,marginBottom:6}}>{T.duelEmpty}</div>
              <div style={{fontSize:13}}>{T.duelEmptySub}</div>
            </div>
          ) : (
            activeDuels.map(d => {
              const s = statusLabel(d.status);
              return (
                <div key={d.id} style={{background:C.card,borderRadius:16,padding:16,marginBottom:10,border:`1px solid ${C.cardBorder}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                    {/* Mini VS inside card */}
                    <div style={{position:"relative",width:42,height:42,flexShrink:0}}>
                      <div style={{width:42,height:42,borderRadius:12,background:"#8B5CF622",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"#8B5CF6",fontSize:16}}>{d.opAvatar}</div>
                      <div style={{position:"absolute",bottom:-4,right:-4,width:16,height:16,borderRadius:6,background:"linear-gradient(135deg,#1A6BFF,#6366F1)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <svg width="8" height="8" viewBox="0 0 12 12"><polygon points="6,1 4,6 7,6 2,11 10,6 7,6 9,1" fill="#F59E0B"/></svg>
                      </div>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:14,color:C.text}}>{d.opponent || T.duelWaitingForOpponent}</div>
                      <div style={{fontSize:11,color:C.subtext}}>{formatTime(d.hoursAgo)}</div>
                    </div>
                    <span style={{fontSize:10,fontWeight:700,background:s.bg,color:s.color,borderRadius:8,padding:"3px 8px"}}>{s.text}</span>
                  </div>
                  {d.status === "your_turn" && (
                    <button onClick={()=>startDuel(d)}
                      style={{width:"100%",padding:"12px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,color:"white",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                      {T.duelStart}
                    </button>
                  )}
                  {d.status === "waiting" && (
                    <div style={{background:C.bg,borderRadius:10,padding:"10px 12px",fontSize:12,color:C.subtext,textAlign:"center"}}>
                      {T.duelWaiting}
                    </div>
                  )}
                </div>
              );
            })
          )
        ) : (
          historyDuels.length === 0 ? (
            <div style={{textAlign:"center",padding:"40px 20px",color:C.subtext,fontSize:14}}>Tarix yo'q</div>
          ) : (
            historyDuels.map(d => {
              const win = (d.myScore ?? 0) > (d.opScore ?? 0);
              const tie = (d.myScore ?? 0) === (d.opScore ?? 0);
              return (
                <div key={d.id} style={{background:C.card,borderRadius:16,padding:16,marginBottom:10,border:`1px solid ${win?"#22C55E44":C.cardBorder}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:40,height:40,borderRadius:12,background:"#8B5CF622",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"#8B5CF6"}}>{d.opAvatar}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:14,color:C.text}}>{d.opponent}</div>
                      <div style={{fontSize:11,color:C.subtext}}>{formatTime(d.hoursAgo)}</div>
                    </div>
                    <div style={{textAlign:"center"}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={{fontWeight:900,fontSize:18,color:tie?C.text:win?"#22C55E":"#EF4444"}}>{d.myScore ?? 0}</span>
                        <svg width="14" height="10" viewBox="0 0 14 10"><polygon points="7,1 3,5 7,9" fill={C.subtext} opacity="0.4"/><polygon points="7,1 11,5 7,9" fill={C.subtext} opacity="0.4"/></svg>
                        <span style={{fontWeight:900,fontSize:18,color:tie?C.text:win?"#EF4444":"#22C55E"}}>{d.opScore ?? 0}</span>
                      </div>
                      <div style={{fontSize:10,fontWeight:700,color:tie?C.subtext:win?"#22C55E":"#EF4444"}}>{tie ? T.duelTie : win ? T.duelWin : T.duelLoss}</div>
                    </div>
                  </div>
                </div>
              );
            })
          )
        )}
      </div>

      {/* Floating invite button */}
      <div style={{position:"fixed",bottom:80,left:16,right:16,width:"calc(100% - 32px)",zIndex:50}}>
        <button onClick={()=>setShowInviteModal(true)}
          style={{width:"100%",padding:"16px",borderRadius:16,border:"none",background:"linear-gradient(135deg,#1A6BFF,#6366F1)",color:"white",fontSize:15,fontWeight:800,cursor:"pointer",boxShadow:"0 6px 24px rgba(26,107,255,0.4)",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><path d="M22 2L15 22l-4-9-9-4 20-7z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {T.duelInvite}
        </button>
      </div>
    </div>
  );
}

// ─── DUEL QUIZ SCREEN ───
function DuelQuizScreen({setScreen,T,C,lang,token,duelId,setDuelResult,addToast}) {
  const [questions,setQuestions]=useState(null);
  const [current,setCurrent]=useState(0);
  const [answers,setAnswers]=useState({});
  const [selected,setSelected]=useState(null);
  const [answered,setAnswered]=useState(false);
  const [submitting,setSubmitting]=useState(false);

  useEffect(()=>{
    if(!token||!duelId) return;
    apiGet(`/duel/${duelId}/questions`, token)
      .then(res=>setQuestions(res.questions))
      .catch(err=>{ console.error(err); addToast?.("Xatolik yuz berdi","error"); setScreen("duel"); });
  },[token,duelId]);

  if(!questions) return <div style={{minHeight:"100vh",background:C.white,display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div style={{color:C.subtext,fontSize:14}}>{T.loading||"Yuklanmoqda..."}</div>
  </div>;

  const q=questions[current];
  const handleAnswer=(optIdx)=>{
    if(answered) return;
    setSelected(optIdx);
    setAnswered(true);
    setAnswers({...answers,[current]:optIdx});
  };
  const goNext=async ()=>{
    if(current+1<questions.length){
      setCurrent(current+1);
      setSelected(answers[current+1]??null);
      setAnswered(answers[current+1]!==undefined);
    } else {
      setSubmitting(true);
      try{
        const res = await apiPost(`/duel/${duelId}/submit`, {answers}, token);
        setDuelResult(res);
      } catch(err){ console.error(err); }
      setScreen("duel-result");
    }
  };
  const goBack=()=>{if(current>0){setCurrent(current-1);setSelected(answers[current-1]??null);setAnswered(answers[current-1]!==undefined);}};
  const explanation=q?.explanation;

  return <div style={{minHeight:"100vh",background:C.white,paddingBottom:90}}>
    <div style={{...SC.header(C),padding:"50px 20px 20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <button onClick={()=>setScreen("duel")} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:10,width:36,height:36,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><IC.ArrowLeft size={18} color="white"/></button>
        <div style={{textAlign:"center"}}><div style={{color:"rgba(255,255,255,0.7)",fontSize:12}}>{T.question}</div><div style={{color:"white",fontWeight:800,fontSize:18}}>{current+1}/{questions.length}</div></div>
        <div style={{width:36}}/>
      </div>
      <div style={{display:"flex",gap:4}}>{questions.map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:100,background:answers[i]!==undefined?"white":i===current?"rgba(255,255,255,0.6)":"rgba(255,255,255,0.2)"}}/>)}</div>
    </div>
    <div style={{padding:20}}>
      <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:20,lineHeight:1.5}}>{getQ(q?.question,lang)}</div>
      <OptionsList options={getOpts(q?.options,lang)} correct={q?.correct||0} selected={selected} onSelect={handleAnswer} C={C}/>
      {answered&&(
        <div style={{marginTop:16,borderRadius:14,padding:"14px 16px",
          background:selected===q.correct?`${C.success}10`:`${C.danger}10`,
          borderLeft:`4px solid ${selected===q.correct?C.success:C.danger}`}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:explanation?10:0}}>
            {selected===q.correct
              ? <IC.CheckCircle size={16} color={C.success}/>
              : <IC.XCircle size={16} color={C.danger}/>}
            <span style={{fontSize:13,fontWeight:700,color:selected===q.correct?C.success:C.danger}}>
              {selected===q.correct?(T.correct||"To'g'ri!"):(T.wrong||"Noto'g'ri!")}
            </span>
            {selected!==q.correct&&(
              <span style={{fontSize:12,color:C.subtext,marginLeft:"auto"}}>
                {T.correct||"To'g'ri"}: {String.fromCharCode(65+q.correct)}
              </span>
            )}
          </div>
          {explanation&&(getQ(explanation,lang))&&<div style={{fontSize:13,color:C.subtext,lineHeight:1.5}}>{getQ(explanation,lang)}</div>}
        </div>
      )}
    </div>
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:C.card,padding:"12px 20px",display:"flex",gap:10,borderTop:`1px solid ${C.cardBorder}`}}>
      <button onClick={goBack} disabled={current===0} style={{flex:1,padding:"14px",borderRadius:14,border:`1.5px solid ${C.gray200}`,background:"transparent",color:current===0?C.gray300:C.text,fontWeight:700,fontSize:14,cursor:current===0?"default":"pointer"}}>{T.back||"Orqaga"}</button>
      <button onClick={goNext} disabled={!answered||submitting} style={{flex:2,padding:"14px",borderRadius:14,border:"none",background:(!answered||submitting)?C.gray300:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,color:"white",fontWeight:700,fontSize:14,cursor:(!answered||submitting)?"default":"pointer"}}>
        {current+1<questions.length ? (T.next||"Keyingisi") : (submitting?(T.loading||"Yuklanmoqda..."):(T.finish||"Yakunlash"))}
      </button>
    </div>
  </div>;
}

// ─── DUEL RESULT SCREEN ───
function DuelResultScreen({setScreen,T,C,duelResult}) {
  if(!duelResult) return null;
  const {myScore,opScore,status}=duelResult;
  const done = status==="done";
  const win = done && myScore>opScore;
  const tie = done && myScore===opScore;

  return <div style={{minHeight:"100vh",background:C.white,paddingBottom:90,display:"flex",flexDirection:"column"}}>
    <div style={{...SC.header(C),padding:"60px 20px 40px",textAlign:"center"}}>
      <div style={{width:72,height:72,borderRadius:"50%",background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
        <IC.CheckCircle size={36} color="white"/>
      </div>
      <h2 style={{color:"white",fontSize:20,fontWeight:900,margin:"0 0 6px"}}>{T.duelSubmitted}</h2>
      <p style={{color:"rgba(255,255,255,0.8)",fontSize:13,margin:0}}>
        {done ? (tie?T.duelTie:win?T.duelWin:T.duelLoss) : T.duelWaitingOpponentResult}
      </p>
    </div>
    <div style={{padding:20,flex:1}}>
      <Card C={C} style={{textAlign:"center",padding:24}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:20}}>
          <div>
            <div style={{fontSize:11,color:C.subtext,marginBottom:6,fontWeight:600}}>{T.duelYou}</div>
            <div style={{fontSize:36,fontWeight:900,color:done?(tie?C.text:win?C.success:C.danger):C.text}}>{myScore}</div>
          </div>
          <svg width="20" height="14" viewBox="0 0 14 10"><polygon points="7,1 3,5 7,9" fill={C.subtext} opacity="0.4"/><polygon points="7,1 11,5 7,9" fill={C.subtext} opacity="0.4"/></svg>
          <div>
            <div style={{fontSize:11,color:C.subtext,marginBottom:6,fontWeight:600}}>{T.duelOpponent}</div>
            <div style={{fontSize:36,fontWeight:900,color:done?(tie?C.text:win?C.danger:C.success):C.gray300}}>{done?opScore:"?"}</div>
          </div>
        </div>
      </Card>
    </div>
    <div style={{padding:20}}>
      <button onClick={()=>setScreen("duel")} style={{width:"100%",padding:"15px",borderRadius:16,border:"none",background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,color:"white",fontSize:15,fontWeight:800,cursor:"pointer"}}>{T.duelBackList}</button>
    </div>
  </div>;
}


// ─── REFERRAL SCREEN ───
function ReferralScreen({setScreen, T, C, user, addToast, token}) {
  const refCode = user?.referralCode || genReferralCode(user);
  // Demo ma'lumotlar (token bo'lmasa / backend javob bermasa ishlatiladi)
  const [invitedCount, setInvitedCount] = useState(4);
  const [history] = useState([
    {name:"Alisher T.", date:"10.06.2025", status:"active"},
    {name:"Bobur M.",   date:"09.06.2025", status:"active"},
    {name:"Sardor K.",  date:"08.06.2025", status:"active"},
    {name:"Zulfiya N.", date:"07.06.2025", status:"active"},
  ]);

  const milestones = REFERRAL_CONFIG.milestones;
  const earned = milestones.filter(m => invitedCount >= m.count);
  const next = nextMilestone(invitedCount);
  const progressPct = next ? Math.min(100, Math.round(invitedCount / next.count * 100)) : 100;

  // Mukofot nomini joriy tilga tarjima qilib qaytaradi (masalan "Haftalik Pro")
  const mLabel = (m) => `${T[m.labelKey]} Pro`;

  // Foydalanuvchi tanlagan Pro muddati so'rovi (admin tasdiqlashini kutadi)
  const [refRequest, setRefRequest] = useState(null);

  // Backenddan haqiqiy taklif qilinganlar sonini va so'rov holatini yuklash
  useEffect(() => {
    if(!token) return;
    apiGet('/referral/me', token).then(res => {
      if(typeof res.invitedCount === "number") setInvitedCount(res.invitedCount);
      if(Array.isArray(res.milestones) && res.milestones.length) REFERRAL_CONFIG.milestones = res.milestones;
      const pending = res.grants?.find(g => g.status === "pending");
      if(pending){
        const pm = (res.milestones||milestones).find(x=>x.count===pending.milestoneCount);
        const label = pm ? `${pending.milestoneCount} ${T.refMilestoneLabel} ${T[pm.labelKey]} Pro` : "";
        setRefRequest({...pending, isMe:true, milestoneLabel:label});
      }
    }).catch(err => console.warn('Referral ma\'lumotlari yuklanmadi:', err));
  }, [token]);

  const claimMilestone = async (m) => {
    if(token){
      try{
        const res = await apiPost('/referral/claim', {milestoneCount:m.count, days:m.days}, token);
        setRefRequest({...res, isMe:true, milestoneLabel:`${m.count} ${T.refMilestoneLabel} ${mLabel(m)}`});
        addToast(T.refRequestSent, "success");
      } catch(err){ console.error(err); addToast(T.refRequestSent, "success"); }
      return;
    }
    const req = {
      id: Date.now(),
      name: ((user?.name||"")+" "+(user?.surname||"")).trim() || "Foydalanuvchi",
      username: user?.username || "",
      milestoneLabel: `${m.count} ${T.refMilestoneLabel} ${mLabel(m)}`,
      days: m.days,
      status: "pending",
      isMe: true,
      tgId: user?.tgId || "me",
    };
    REFERRAL_GRANTS = [req, ...REFERRAL_GRANTS];
    savePersistedAdminData();
    setRefRequest(req);
    addToast(T.refRequestSent, "success");
  };

  const copyCode = () => {
    try { navigator.clipboard.writeText(refCode); } catch {}
    addToast(T.referralCopied || "Nusxalandi!", "success");
  };

  const shareRef = () => {
    const text = `Nazariy avtotestga qo'shiling! Mening referal kodim: ${refCode}
https://t.me/${APP_CONFIG.botUsername}?start=${refCode}`;
    if(window.Telegram?.WebApp?.switchInlineQuery) {
      window.Telegram.WebApp.switchInlineQuery(text);
    } else {
      try { navigator.clipboard.writeText(text); } catch {}
      addToast("Havola nusxalandi!", "success");
    }
  };

  return (
    <div style={{minHeight:"100vh", background:C.bg, paddingBottom:80}}>
      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`, padding:"52px 20px 28px", position:"relative", overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
        <button onClick={()=>setScreen("home")} style={{background:"rgba(255,255,255,0.15)",border:"none",width:36,height:36,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20}}>
          <IC.ArrowLeft size={18} color="white"/>
        </button>
        <div style={{textAlign:"center"}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:8}}><IC.Gift size={44} color="white"/></div>
          <h2 style={{color:"white",fontSize:22,fontWeight:900,margin:"0 0 6px"}}>{T.referralTitle}</h2>
          <p style={{color:"rgba(255,255,255,0.8)",fontSize:13,margin:0,lineHeight:1.6}}>{T.referralSub}</p>
        </div>
      </div>

      <div style={{padding:"20px 16px"}}>

        {/* Referal kod */}
        <div style={{background:C.card,borderRadius:18,padding:18,marginBottom:16,border:`1px solid ${C.cardBorder}`}}>
          <div style={{fontSize:11,fontWeight:700,color:C.subtext,textTransform:"uppercase",letterSpacing:0.5,marginBottom:10}}>
            {T.referralCode}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,background:C.bg,borderRadius:12,padding:"12px 16px",marginBottom:12}}>
            <div style={{flex:1,fontFamily:"monospace",fontSize:20,fontWeight:900,color:C.primary,letterSpacing:3}}>
              {refCode}
            </div>
            <button onClick={copyCode} style={{background:C.primary,border:"none",borderRadius:10,padding:"8px 14px",color:"white",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
              <IC.FileText size={14} color="white"/>
              {T.referralCopy}
            </button>
          </div>
          <button onClick={shareRef} style={{width:"100%",padding:"13px",borderRadius:14,border:"none",background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,color:"white",fontSize:14,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <IC.ArrowRight size={16} color="white"/>
            {T.referralShare}
          </button>
        </div>

        {/* Statistika */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
          <div style={{background:C.card,borderRadius:16,padding:16,border:`1px solid ${C.cardBorder}`,textAlign:"center"}}>
            <div style={{fontSize:32,fontWeight:900,color:C.primary}}>{invitedCount}</div>
            <div style={{fontSize:12,color:C.subtext,marginTop:4}}>{T.referralInvited}</div>
          </div>
          <div style={{background:C.card,borderRadius:16,padding:16,border:`1px solid ${C.cardBorder}`,textAlign:"center"}}>
            <div style={{fontSize:32,fontWeight:900,color:"#22C55E"}}>{earned.length}</div>
            <div style={{fontSize:12,color:C.subtext,marginTop:4}}>{T.referralEarned}</div>
          </div>
        </div>

        {/* Keyingi mukofotga progress */}
        {next && (
          <div style={{background:C.card,borderRadius:16,padding:16,marginBottom:16,border:`1px solid ${C.cardBorder}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:13,fontWeight:700,color:C.text}}>{T.referralProgress}</div>
              <div style={{fontSize:12,color:C.primary,fontWeight:700}}>{invitedCount}/{next.count} ta</div>
            </div>
            <div style={{background:C.gray200,borderRadius:100,height:10,overflow:"hidden",marginBottom:8}}>
              <div style={{height:"100%",width:`${progressPct}%`,background:`linear-gradient(90deg,${C.gradStart},${C.gradEnd})`,borderRadius:100,transition:"width 0.5s"}}/>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <IC.Diamond size={14} color="#8B5CF6"/>
              <span style={{fontSize:12,color:C.subtext}}>
                {next.count - invitedCount} {T.refNextReward} <strong style={{color:C.text}}>{mLabel(next)}</strong> {T.refRewardGet}
              </span>
            </div>
          </div>
        )}

        {/* Mukofot darajalari */}
        <div style={{background:C.card,borderRadius:16,padding:16,marginBottom:16,border:`1px solid ${C.cardBorder}`}}>
          <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:12}}>{T.referralRewards}</div>
          {refRequest && (
            <div style={{background:C.primary+"10",border:`1px solid ${C.primary}30`,borderRadius:12,padding:"10px 12px",marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
              <IC.Clock size={16} color={C.primary}/>
              <span style={{fontSize:12,color:C.text}}>{T.refRequestPending}: <strong>{refRequest.milestoneLabel}</strong></span>
            </div>
          )}
          {milestones.map(m => {
            const done = invitedCount >= m.count;
            const isThisRequested = refRequest && refRequest.milestoneLabel === `${m.count} ${T.refMilestoneLabel} ${mLabel(m)}`;
            return (
              <div key={m.count} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${C.gray100}`}}>
                <div style={{width:40,height:40,borderRadius:12,background:done?"linear-gradient(135deg,#8B5CF6,#6366F1)":C.gray100,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {done
                    ? <IC.CheckCircle size={20} color="white"/>
                    : <span style={{fontSize:14,fontWeight:900,color:C.muted}}>{m.count}</span>
                  }
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:13,color:done?C.text:C.subtext}}>{m.count} {T.refMilestoneLabel} {mLabel(m)}</div>
                  <div style={{fontSize:11,color:C.subtext,marginTop:2}}>{m.days} {T.refMilestoneDays}</div>
                </div>
                {done
                  ? (isThisRequested
                      ? <span style={{fontSize:10,fontWeight:800,background:"#FEF3C7",color:"#92400E",borderRadius:8,padding:"3px 8px",display:"flex",alignItems:"center",gap:3}}><IC.Clock size={11} color="#92400E"/>{T.adminStatusPending}</span>
                      : refRequest
                        ? <span style={{fontSize:10,fontWeight:700,color:C.muted}}>—</span>
                        : <button onClick={()=>claimMilestone(m)} style={{fontSize:11,fontWeight:800,background:C.primary,color:"white",borderRadius:8,padding:"6px 12px",border:"none",cursor:"pointer"}}>{T.refChooseBtn}</button>
                    )
                  : <span style={{fontSize:10,fontWeight:700,color:C.muted}}>{m.count - Math.min(invitedCount, m.count)} {T.refRemaining}</span>
                }
              </div>
            );
          })}
        </div>

        {/* Qanday ishlaydi */}
        <div style={{background:C.card,borderRadius:16,padding:16,marginBottom:16,border:`1px solid ${C.cardBorder}`}}>
          <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:12}}>{T.referralHowTitle}</div>
          {[
            {num:"1", text:T.referralStep1, color:C.primary},
            {num:"2", text:T.referralStep2, color:"#8B5CF6"},
            {num:"3", text:T.referralStep3, color:"#22C55E"},
          ].map(s => (
            <div key={s.num} style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:12}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:s.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"white",fontWeight:800,fontSize:13}}>
                {s.num}
              </div>
              <p style={{margin:0,fontSize:13,color:C.subtext,lineHeight:1.5,paddingTop:4}}>{s.text}</p>
            </div>
          ))}
        </div>

        {/* Taklif tarixi */}
        {history.length > 0 && (
          <div style={{background:C.card,borderRadius:16,padding:16,border:`1px solid ${C.cardBorder}`}}>
            <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:12}}>{T.referralHistory}</div>
            {history.map((h,i) => (
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:i<history.length-1?`1px solid ${C.gray100}`:"none"}}>
                <div style={{width:34,height:34,borderRadius:10,background:C.primary+"18",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:C.primary,fontSize:13}}>
                  {h.name[0]}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:13,color:C.text}}>{h.name}</div>
                  <div style={{fontSize:11,color:C.subtext}}>{h.date}</div>
                </div>
                <span style={{fontSize:10,fontWeight:700,background:"#DCFCE7",color:"#16A34A",borderRadius:6,padding:"2px 8px"}}>Faol</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileScreen({setScreen,user,setUser,T,C,dark,setDark,lang,setLang,savedQuestions,setShowLangModal,tgUser}) {
  const [editing,setEditing]=useState(false);
  const [form,setForm]=useState({name:user?.name||"",surname:user?.surname||"",phone:user?.phone||""});

  const saveProfile=()=>{
    setUser({...user,...form});
    setEditing(false);
  };

  const openTg = (username) => {
    const url = `https://t.me/${username}`;
    if(window.Telegram?.WebApp?.openTelegramLink) {
      window.Telegram.WebApp.openTelegramLink(url);
    } else {
      window.open(url, '_blank');
    }
  };

  const menuItems=[
    {lk:"pro",      Icon:IC.Diamond,    ic:"#F59E0B", bg:"#FEF3C7", action:()=>setScreen("pro")},
    {lk:"referral", Icon:IC.Trophy,     ic:"#EF4444", bg:"#FEE2E2", action:()=>setScreen("referral")},
    {lk:"lang",     Icon:IC.Globe,      ic:C.primary, bg:"#EBF2FF", right:LANGS[lang].label, action:()=>setShowLangModal(true)},
    {lk:"support",  Icon:IC.Headphones, ic:"#22C55E", bg:"#DCFCE7", right:"@"+APP_CONFIG.supportUsername, action:()=>openTg(APP_CONFIG.supportUsername)},
    {lk:"news",     Icon:IC.TelegramIcon, ic:"#229ED9", bg:"#E3F2FD", right:"@"+APP_CONFIG.newsChannel, action:()=>openTg(APP_CONFIG.newsChannel)},
    {lk:"about",    Icon:IC.Info,       ic:C.primary, bg:"#EBF2FF", action:()=>setScreen("about")},
    ...(user?.isAdmin ? [{lk:"adminPanel", Icon:IC.Shield, ic:"#1E293B", bg:"#E2E8F0", action:()=>setScreen("admin")}] : []),
  ];

  // Edit modal
  const EditModal=()=>(
    <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={()=>setEditing(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)"}}/>
      <div style={{position:"relative",width:"100%",maxWidth:390,background:C.card,borderRadius:"24px 24px 0 0",padding:"24px 20px 40px",zIndex:1}}>
        {/* Handle */}
        <div style={{width:40,height:4,borderRadius:2,background:C.gray300,margin:"0 auto 20px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <span style={{fontWeight:800,fontSize:17,color:C.text}}>{T.editProfile}</span>
          <button onClick={()=>setEditing(false)} style={{background:C.gray100,border:"none",borderRadius:10,width:32,height:32,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <IC.XCircle size={18} color={C.gray400}/>
          </button>
        </div>

        {/* Avatar big */}
        <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
          <div style={{position:"relative"}}>
            <div style={{width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,#F59E0B,#EF4444)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,fontWeight:800,color:"white"}}>
              {(form.name||"A")[0]}
            </div>
            <div style={{position:"absolute",bottom:0,right:0,width:24,height:24,borderRadius:"50%",background:C.primary,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 6px rgba(0,0,0,0.2)"}}>
              <IC.Edit size={12} color="white"/>
            </div>
          </div>
        </div>

        {/* Fields */}
        {[
          {label:"Ism",key:"name",icon:<IC.User size={16} color={C.gray400}/>},
          {label:"Familiya",key:"surname",icon:<IC.User size={16} color={C.gray400}/>},
          {label:"Telefon",key:"phone",icon:<IC.Phone size={16} color={C.gray400}/>},
        ].map(f=>(
          <div key={f.key} style={{marginBottom:14}}>
            <label style={{fontSize:12,color:C.subtext,fontWeight:600,display:"block",marginBottom:6}}>{f.label}</label>
            <div style={{display:"flex",alignItems:"center",gap:10,background:C.inputBg,borderRadius:12,padding:"12px 14px",border:`1.5px solid ${C.gray200}`}}>
              {f.icon}
              <input
                value={form[f.key]}
                onChange={e=>setForm({...form,[f.key]:e.target.value})}
                style={{flex:1,border:"none",background:"transparent",fontSize:14,outline:"none",color:C.text}}
              />
            </div>
          </div>
        ))}

        <button onClick={saveProfile}
          style={{width:"100%",padding:"15px",borderRadius:16,border:"none",background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,color:"white",fontSize:15,fontWeight:800,cursor:"pointer",marginTop:4,boxShadow:"0 4px 16px rgba(26,107,255,0.3)"}}>
          {T.save}
        </button>
      </div>
    </div>
  );

  return <div style={{paddingBottom:16}}>
    {editing&&<EditModal/>}
    <div style={{background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,padding:"52px 20px 32px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div style={{display:"flex",gap:14,alignItems:"center"}}>
          {tgUser?.photo_url
            ? <img src={tgUser.photo_url} style={{width:64,height:64,borderRadius:"50%",objectFit:"cover",boxShadow:"0 4px 16px rgba(0,0,0,0.2)"}} alt="avatar"/>
            : <div style={{width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,#F59E0B,#EF4444)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:800,color:"white",boxShadow:"0 4px 16px rgba(0,0,0,0.2)"}}>{(user?.name||"A")[0]}</div>
          }
          <div><div style={{color:"white",fontWeight:800,fontSize:18}}>{user?.name} {user?.surname}</div><div style={{color:"rgba(255,255,255,0.75)",fontSize:13}}>{user?.phone}</div></div>
        </div>
        <div onClick={()=>{setForm({name:user?.name||"",surname:user?.surname||"",phone:user?.phone||""});setEditing(true);}} style={{width:36,height:36,background:"rgba(255,255,255,0.2)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><IC.Edit size={16} color="white"/></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginTop:20}}>
        {[{lk:"exams",val:"8"},{lk:"passed",val:"5"},{lk:"notPassed",val:"3"},{lk:"rating",val:"#24"}].map(s=><div key={s.lk} style={{background:"rgba(255,255,255,0.2)",borderRadius:12,padding:"10px 4px",textAlign:"center"}}><div style={{color:"white",fontWeight:800,fontSize:18}}>{s.val}</div><div style={{color:"rgba(255,255,255,0.7)",fontSize:10}}>{T[s.lk]}</div></div>)}
      </div>
    </div>
    <div style={{padding:16}}>
      {menuItems.map(item=>(
        <div key={item.lk}>
          <Card C={C} style={{marginBottom:10,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,cursor:"pointer",...(item.danger?{background:dark?"#2D1515":"#FEF2F2"}:{})}} onClick={item.action||(()=>{})}>
            <div style={{width:38,height:38,borderRadius:12,background:item.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <item.Icon size={18} color={item.ic}/>
            </div>
            <span style={{flex:1,fontWeight:600,fontSize:14,color:item.danger?C.danger:C.text}}>{T[item.lk]}</span>
            {item.badge&&<div style={{minWidth:22,height:22,borderRadius:11,background:"#F59E0B",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"white",padding:"0 6px"}}>{item.badge}</div>}
            {item.right&&<span style={{fontSize:12,color:C.subtext}}>{item.right}</span>}
            {!item.right&&!item.badge&&<IC.ChevronRight size={16} color={C.gray400}/>}
            {item.badge&&<IC.ChevronRight size={16} color={C.gray400}/>}
          </Card>
          {item.lk==="lang"&&(
            <Card C={C} style={{marginBottom:10,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:38,height:38,borderRadius:12,background:dark?"#1E3A5F":"#FEF3C7",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {dark?<IC.Moon size={18} color={C.primary}/>:<IC.Sun size={18} color={C.warning}/>}
                </div>
                <span style={{fontWeight:600,fontSize:14,color:C.text}}>{dark?T.darkMode:T.lightMode}</span>
              </div>
              <div onClick={()=>setDark(!dark)} style={{width:48,height:26,borderRadius:13,background:dark?C.primary:C.gray300,cursor:"pointer",position:"relative",transition:"background 0.2s"}}>
                <div style={{position:"absolute",top:3,left:dark?22:3,width:20,height:20,borderRadius:"50%",background:"white",transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)"}}/>
              </div>
            </Card>
          )}
          {item.lk==="lang"&&(
            <Card C={C} style={{marginBottom:10,padding:"14px 16px",cursor:"pointer"}} onClick={()=>setScreen("saved")}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:savedQuestions.length>0?12:0}}>
                <div style={{width:38,height:38,borderRadius:12,background:"#FEF3C7",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <IC.Bookmark size={18} color="#F59E0B"/>
                </div>
                <span style={{flex:1,fontWeight:600,fontSize:14,color:C.text}}>{T.savedQ}</span>
                {savedQuestions.length>0&&<div style={{minWidth:22,height:22,borderRadius:11,background:"#F59E0B",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"white",padding:"0 6px"}}>{savedQuestions.length}</div>}
                <IC.ChevronRight size={16} color={C.gray400} onClick={()=>setScreen("saved")} style={{cursor:"pointer"}}/>
              </div>
              {savedQuestions.length>0&&savedQuestions.slice(0,3).map((q,i)=>(
                <div key={q.key} onClick={()=>setScreen("saved")} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderTop:`1px solid ${C.gray200}`,cursor:"pointer"}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:"#F59E0B",flexShrink:0}}/>
                  <span style={{fontSize:12,color:C.subtext,flex:1,lineHeight:1.4,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>
                    {typeof q.question==="object"?q.question.uz||q.question:q.question}
                  </span>
                </div>
              ))}
              {savedQuestions.length>3&&(
                <div onClick={()=>setScreen("saved")} style={{textAlign:"center",paddingTop:8,borderTop:`1px solid ${C.gray200}`,fontSize:12,color:C.primary,fontWeight:600,cursor:"pointer"}}>
                  {T.allBtn} ({savedQuestions.length-3} {T.savedCount})
                </div>
              )}
            </Card>
          )}
        </div>
      ))}
    </div>
  </div>;
}

// ─── PRO SCREEN ───
function ProScreen({T,C,setScreen,addToast,setNotifs,notifSettings,user,token,bumpDataVersion}) {
  const [plan,setPlan]=useState("month1");

  // step: "plans" | "payment" | "pending"
  const [step,setStep]=useState("plans");

  // To'lov uchun
  const [receipt,setReceipt]=useState(null);      // yuklangan fayl/rasm
  const [receiptPreview,setReceiptPreview]=useState(null); // preview URL
  const fileInputRef=useRef();

  // Chegirmali narxlar (admin tomonidan o'zgartirilishi mumkin)
  const rawPrices = PRICES;
  const plans = [
    {id:"week",   labelKey:"proWeekly",  days:7,  badge:null,          ...calcDiscounted(rawPrices.week)},
    {id:"month1", labelKey:"proMonth1",  days:30, badge:T.proPopular,  ...calcDiscounted(rawPrices.month1)},
    {id:"month2", labelKey:"proMonth2",  days:60, badge:T.proBest,     ...calcDiscounted(rawPrices.month2)},
  ];
  const daysLeft = discountDaysLeft();

  const features=[
    {Icon:IC.Bell,      color:"#fff", bg:C.primary,   lk:"proNoAds"},
    {Icon:IC.Clipboard, color:"#fff", bg:"#0EA5E9",   lk:"proUnlimited"},
    {Icon:IC.BarChart,  color:"#fff", bg:"#6366F1",   lk:"proStats"},
  ];

  const selectedPlan=plans.find(p=>p.id===plan);

  // Karta raqami (admin o'zgartiradi)
  const CARD_NUMBER = "8600 1234 5678 9012";
  const CARD_OWNER  = "NAZARIY AVTOTEST";

  const copyCard=()=>{
    try{ navigator.clipboard.writeText(CARD_NUMBER.replace(/\s/g,"")); }catch{}
    addToast("Karta raqami nusxalandi!", "success");
  };

  const handleFileChange=(e)=>{
    const file=e.target.files[0];
    if(!file) return;
    setReceipt(file);
    const url=URL.createObjectURL(file);
    setReceiptPreview(url);
  };

  const handleSubmit=async ()=>{
    if(!receipt){ addToast("Avval to\'lov chekini yuklang","error"); return; }

    // Kutish rejimiga o'tish
    setStep("pending");

    if(token){
      try{
        const formData = new FormData();
        formData.append('receipt', receipt);
        formData.append('planLabel', selectedPlan.labelKey);
        await apiUpload('/pro/requests', formData, token);
        bumpDataVersion?.();
      } catch(err){ console.error(err); }
    } else {
      // Admin paneliga so'rov yuboriladi (offline rejim)
      PRO_REQUESTS = [{
        id: Date.now(),
        name: ((user?.name||"")+" "+(user?.surname||"")).trim() || "Foydalanuvchi",
        username: user?.username || "",
        planLabel: T[selectedPlan.labelKey],
        amount: selectedPlan.final.toLocaleString(),
        planDays: selectedPlan.days,
        receiptName: receipt?.name,
        receiptPreview: receiptPreview,
        receiptType: receipt?.type,
        status: "pending",
        isMe: true,
        tgId: user?.tgId || "me",
      }, ...PRO_REQUESTS];
      savePersistedAdminData();
    }

    // Bildirishnoma: "To'lov tekshirilmoqda"
    const pendingMsg={
      uz:"To'lov chekingiz yuborildi. Tekshirilmoqda ⏳",
      ru:"Чек оплаты отправлен. Проверяется ⏳",
      kril:"To'lov chekingiz yuborildi. Tekshirilmoqda ⏳",
    };
    setNotifs(p=>[{
      id:Date.now(), type:"result", read:false, time:0,
      titleKey:"notifResult",
      body:pendingMsg,
    },...p]);
    addToast(pendingMsg.uz, "info");
  };

  // ── PENDING ekrani ──
  if(step==="pending") return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column"}}>
      <div style={{background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,padding:"52px 20px 36px",position:"relative",overflow:"hidden",textAlign:"center"}}>
        <div style={{position:"absolute",top:-50,right:-50,width:180,height:180,borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
        <div style={{position:"absolute",bottom:-40,left:-30,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
        {/* Animatsiyali soat */}
        <div style={{width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.18)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",boxShadow:"0 8px 24px rgba(0,0,0,0.2)",position:"relative"}}>
          <IC.Clock size={40} color="white"/>
          <div style={{position:"absolute",inset:-4,borderRadius:"50%",border:"3px solid rgba(255,255,255,0.3)",borderTopColor:"white",animation:"spin 1.5s linear infinite"}}/>
        </div>
        <div style={{color:"white",fontWeight:900,fontSize:22,marginBottom:8}}>{T.proCheckingTitle}</div>
        <div style={{color:"rgba(255,255,255,0.8)",fontSize:13,lineHeight:1.6,maxWidth:280,margin:"0 auto"}}>
          {T.proCheckingDesc1}<br/>{T.proCheckingDesc2}
        </div>
      </div>

      <div style={{padding:"24px 16px",flex:1}}>
        {/* To'lov ma'lumotlari */}
        <div style={{background:C.card,borderRadius:18,padding:18,marginBottom:16,border:`1px solid ${C.cardBorder}`}}>
          <div style={{fontSize:12,color:C.subtext,fontWeight:700,marginBottom:12,textTransform:"uppercase",letterSpacing:0.5}}>{T.proPaymentDetails}</div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <span style={{fontSize:13,color:C.subtext}}>{T.proTariff}</span>
            <span style={{fontSize:13,fontWeight:700,color:C.text}}>{T[selectedPlan.labelKey]} — {selectedPlan.final.toLocaleString()} so'm</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <span style={{fontSize:13,color:C.subtext}}>{T.proStatus}</span>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:"#F59E0B",animation:"pulse 1.5s ease infinite"}}/>
              <span style={{fontSize:13,fontWeight:700,color:"#F59E0B"}}>{T.adminStatusPending}</span>
            </div>
          </div>
          {receiptPreview&&(
            <div style={{marginTop:12,borderTop:`1px solid ${C.gray200}`,paddingTop:12}}>
              <div style={{fontSize:12,color:C.subtext,marginBottom:8}}>{T.proUploadedReceipt}</div>
              {receipt?.type?.startsWith("image/")
                ? <img src={receiptPreview} style={{width:"100%",borderRadius:12,maxHeight:160,objectFit:"cover"}} alt="receipt"/>
                : <div style={{display:"flex",alignItems:"center",gap:10,background:C.gray100,borderRadius:12,padding:"10px 14px"}}>
                    <IC.FileText size={20} color={C.primary}/>
                    <span style={{fontSize:13,color:C.text,fontWeight:500}}>{receipt?.name}</span>
                  </div>
              }
            </div>
          )}
        </div>

        {/* Kutish animatsiyasi */}
        <div style={{background:C.primary+"10",borderRadius:16,padding:"16px",display:"flex",alignItems:"flex-start",gap:12,border:`1px solid ${C.primary}22`}}>
          <IC.Bell size={18} color={C.primary} style={{flexShrink:0,marginTop:2}}/>
          <div style={{fontSize:13,color:C.subtext,lineHeight:1.6}}>
            {T.proAdminCheckDesc1} <span style={{fontWeight:700,color:C.text}}>10-30 {T.proMinutes}</span> {T.proAdminCheckDesc2}
          </div>
        </div>

        <button onClick={()=>setScreen("home")}
          style={{width:"100%",marginTop:20,padding:"15px",borderRadius:16,border:`2px solid ${C.gray200}`,background:"transparent",color:C.text,fontSize:14,fontWeight:700,cursor:"pointer"}}>
          {T.goHome}
        </button>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  );

  // ── PAYMENT ekrani ──
  if(step==="payment") return (
    <div style={{minHeight:"100vh",background:C.bg,paddingBottom:24}}>
      {/* Header */}
      <div style={{...SC.header(C),padding:"52px 20px 28px"}}>
        <button onClick={()=>setStep("plans")}
          style={{background:"rgba(255,255,255,0.15)",border:"none",width:36,height:36,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20}}>
          <IC.ArrowLeft size={18} color="white"/>
        </button>
        <div style={{color:"white",fontWeight:900,fontSize:20,marginBottom:4}}>{T.proPaymentTitle}</div>
        <div style={{color:"rgba(255,255,255,0.8)",fontSize:13,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <span>{T[selectedPlan.labelKey]}</span>
          {selectedPlan.saved > 0 && (
            <span style={{textDecoration:"line-through",opacity:0.6}}>{selectedPlan.original.toLocaleString()} so'm</span>
          )}
          <span style={{fontWeight:800,color:"white"}}>{selectedPlan.final.toLocaleString()} so'm</span>
          {selectedPlan.saved > 0 && (
            <span style={{background:"rgba(255,255,255,0.25)",borderRadius:8,padding:"2px 8px",fontSize:11,fontWeight:700}}>
              -{DISCOUNT.percent}% {T.proSavingPct}
            </span>
          )}
        </div>
      </div>

      <div style={{padding:"20px 16px"}}>

        {/* Karta raqami */}
        <div style={{background:C.card,borderRadius:20,padding:20,marginBottom:16,border:`1px solid ${C.cardBorder}`,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
          <div style={{fontSize:12,color:C.subtext,fontWeight:700,marginBottom:14,textTransform:"uppercase",letterSpacing:0.5}}>
            {T.proPayToCard}
          </div>

          {/* Karta dizayni */}
          <div style={{background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,borderRadius:16,padding:"20px 20px 16px",marginBottom:14,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-20,right:-20,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.08)"}}/>
            <div style={{position:"absolute",bottom:-30,left:10,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.6)",fontWeight:600,marginBottom:12,letterSpacing:1}}>HUMO / UZCARD</div>
            <div style={{color:"white",fontSize:17,fontWeight:800,letterSpacing:2,marginBottom:16,fontFamily:"monospace",whiteSpace:"nowrap"}}>
              {CARD_NUMBER}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
              <div>
                <div style={{fontSize:9,color:"rgba(255,255,255,0.5)",marginBottom:2}}>{T.proCardOwner}</div>
                <div style={{color:"white",fontWeight:700,fontSize:13}}>{CARD_OWNER}</div>
              </div>
              <div style={{background:"rgba(255,255,255,0.2)",borderRadius:8,padding:"4px 10px",fontSize:12,color:"white",fontWeight:700}}>
                {selectedPlan.final.toLocaleString()} so'm
              </div>
            </div>
          </div>

          {/* Nusxalash tugmasi */}
          <button onClick={copyCard}
            style={{width:"100%",padding:"13px",borderRadius:14,border:`1.5px solid ${C.primary}`,background:C.primary+"10",color:C.primary,fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <IC.FileText size={16} color={C.primary}/>
            {T.proCopyCardBtn}
          </button>
        </div>

        {/* Chek yuklash */}
        <div style={{background:C.card,borderRadius:20,padding:20,marginBottom:20,border:`1px solid ${C.cardBorder}`}}>
          <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:4}}>{T.proUploadReceiptTitle}</div>
          <div style={{fontSize:12,color:C.subtext,marginBottom:16,lineHeight:1.5}}>
            {T.proUploadReceiptDesc}
          </div>

          {/* Yuklash maydoni */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            style={{display:"none"}}
          />

          {!receiptPreview ? (
            <div onClick={()=>fileInputRef.current?.click()}
              style={{border:`2px dashed ${C.gray300}`,borderRadius:16,padding:"32px 20px",textAlign:"center",cursor:"pointer",background:C.gray100,transition:"all 0.2s"}}>
              <div style={{width:52,height:52,borderRadius:16,background:C.primary+"18",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
                <IC.FileText size={24} color={C.primary}/>
              </div>
              <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:4}}>{T.proUploadFileBtn}</div>
              <div style={{fontSize:12,color:C.subtext}}>{T.proFileTypes}</div>
            </div>
          ) : (
            <div style={{position:"relative"}}>
              {receipt?.type?.startsWith("image/")
                ? <img src={receiptPreview} style={{width:"100%",borderRadius:14,maxHeight:200,objectFit:"cover"}} alt="receipt"/>
                : <div style={{display:"flex",alignItems:"center",gap:12,background:C.gray100,borderRadius:14,padding:"14px 16px"}}>
                    <div style={{width:44,height:44,borderRadius:12,background:C.primary+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <IC.FileText size={22} color={C.primary}/>
                    </div>
                    <div>
                      <div style={{fontWeight:600,fontSize:13,color:C.text}}>{receipt?.name}</div>
                      <div style={{fontSize:11,color:C.subtext}}>{(receipt?.size/1024).toFixed(0)} KB</div>
                    </div>
                  </div>
              }
              {/* O'chirish */}
              <button onClick={()=>{setReceipt(null);setReceiptPreview(null);}}
                style={{position:"absolute",top:8,right:8,width:28,height:28,borderRadius:"50%",background:"rgba(0,0,0,0.5)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <IC.XCircle size={16} color="white"/>
              </button>
              {/* Qayta yuklash */}
              <button onClick={()=>fileInputRef.current?.click()}
                style={{width:"100%",marginTop:10,padding:"10px",borderRadius:12,border:`1.5px solid ${C.gray200}`,background:"transparent",color:C.subtext,fontSize:12,fontWeight:600,cursor:"pointer"}}>
                {T.proChooseAnotherFile}
              </button>
            </div>
          )}
        </div>

        {/* Yuborish tugmasi */}
        <button onClick={handleSubmit}
          style={{width:"100%",padding:"16px",borderRadius:18,border:"none",background:receipt?`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`:C.gray200,color:receipt?"white":C.gray400,fontSize:15,fontWeight:800,cursor:receipt?"pointer":"not-allowed",boxShadow:receipt?`0 6px 20px ${C.primary}50`:"none",transition:"all 0.3s"}}>
          <span style={{display:"flex",alignItems:"center",gap:6,justifyContent:"center"}}><IC.Send size={16} color="white"/>{T.proSendReceiptBtn}</span>
        </button>

        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginTop:12}}>
          <IC.ShieldCheck size={14} color={C.success}/>
          <span style={{fontSize:11,color:C.subtext}}>{T.proDataSecure}</span>
        </div>
      </div>
    </div>
  );

  // ── PLANS ekrani (asosiy) ──
  return (
    <div style={{minHeight:"100vh",background:C.bg,paddingBottom:24}}>
      {/* Header */}
      <div style={{...SC.header(C),padding:"52px 20px 36px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-50,right:-50,width:180,height:180,borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
        <div style={{position:"absolute",bottom:-70,left:-40,width:220,height:220,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
        <button onClick={()=>setScreen("profile")}
          style={{background:"rgba(255,255,255,0.15)",border:"none",width:36,height:36,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24}}>
          <IC.ArrowLeft size={18} color="white"/>
        </button>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,position:"relative"}}>
          <div style={{width:76,height:76,borderRadius:24,background:"rgba(255,255,255,0.18)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 24px rgba(0,0,0,0.2)"}}>
            <IC.Diamond size={38} color="white"/>
          </div>
          <div style={{color:"white",fontWeight:900,fontSize:24,textAlign:"center",letterSpacing:-0.5}}>{T.proTitle}</div>
          <div style={{color:"rgba(255,255,255,0.8)",fontSize:13,textAlign:"center",maxWidth:260,lineHeight:1.5}}>{T.proSubtitle}</div>
        </div>
      </div>

      <div style={{padding:"20px 16px"}}>
        {/* Chegirma banneri */}
        {DISCOUNT.active && DISCOUNT.percent > 0 && (
          <div style={{background:"linear-gradient(135deg,#EF4444,#F59E0B)",borderRadius:16,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
            <IC.Celebrate size={24} color="white"/>
            <div style={{flex:1}}>
              <div style={{color:"white",fontWeight:800,fontSize:14}}>{T.discountLabel} — -{DISCOUNT.percent}%</div>
              {daysLeft !== null && daysLeft > 0 && (
                <div style={{color:"rgba(255,255,255,0.85)",fontSize:12,marginTop:2}}>
                  {daysLeft} kun qoldi • Ulguring!
                </div>
              )}
              {daysLeft === 0 && (
                <div style={{color:"rgba(255,255,255,0.85)",fontSize:12,marginTop:2}}>{T.discountEnds}</div>
              )}
            </div>
            <div style={{background:"rgba(255,255,255,0.25)",borderRadius:10,padding:"6px 10px",textAlign:"center"}}>
              <div style={{color:"white",fontWeight:900,fontSize:20,lineHeight:1}}>-{DISCOUNT.percent}%</div>
              <div style={{color:"rgba(255,255,255,0.8)",fontSize:9,fontWeight:700}}>{T.discountBadge}</div>
            </div>
          </div>
        )}

        {/* Tariflar */}
        <div style={{display:"flex",gap:8,marginBottom:20}}>
          {plans.map(p=>{
            const sel=plan===p.id;
            return (
              <div key={p.id} onClick={()=>setPlan(p.id)}
                style={{flex:1,borderRadius:18,border:`2px solid ${sel?C.primary:C.gray200}`,background:sel?`linear-gradient(135deg,${C.primary}18,${C.primary}30)`:C.card,padding:"14px 6px",cursor:"pointer",textAlign:"center",position:"relative",transition:"all 0.2s",boxShadow:sel?`0 4px 16px ${C.primary}40`:"none"}}>
                {p.badge&&<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:sel?C.primary:"#94A3B8",color:"white",fontSize:9,fontWeight:800,borderRadius:20,padding:"2px 8px",whiteSpace:"nowrap"}}>{p.badge}</div>}
                {/* Chegirmali narx ko'rsatish */}
                {p.saved > 0 && (
                  <div style={{fontSize:8,fontWeight:800,color:"#EF4444",textDecoration:"line-through",lineHeight:1,marginBottom:1}}>
                    {p.original.toLocaleString()}
                  </div>
                )}
                <div style={{fontWeight:900,fontSize:16,color:sel?C.primary:C.text,marginBottom:2,lineHeight:1}}>
                  {p.final.toLocaleString()}
                </div>
                <div style={{fontSize:9,color:sel?C.primary:C.subtext,fontWeight:700,marginBottom:4}}>so'm</div>
                {p.saved > 0 && (
                  <div style={{fontSize:8,fontWeight:800,background:"#EF4444",color:"white",borderRadius:4,padding:"1px 4px",marginBottom:3}}>
                    -{DISCOUNT.percent}%
                  </div>
                )}
                <div style={{fontSize:10,color:sel?C.primary:C.subtext,fontWeight:700}}>{T[p.labelKey]}</div>
              </div>
            );
          })}
        </div>

        {/* Imkoniyatlar */}
        <div style={{marginBottom:20}}>
          {features.map(f=>(
            <div key={f.lk} style={{display:"flex",alignItems:"center",gap:14,padding:"13px 16px",background:C.card,borderRadius:16,marginBottom:8,border:`1px solid ${C.cardBorder}`,boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
              <div style={{width:44,height:44,borderRadius:14,background:f.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 4px 12px ${f.bg}55`}}>
                <f.Icon size={20} color={f.color}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:13,color:C.text}}>{T[f.lk]}</div>
                <div style={{fontSize:11,color:C.subtext,marginTop:2}}>{T[f.lk+"Sub"]}</div>
              </div>
              <IC.CheckCircle size={20} color="#22C55E"/>
            </div>
          ))}
        </div>

        {/* Obuna tugmasi */}
        <button onClick={()=>setStep("payment")}
          style={{width:"100%",padding:"16px",borderRadius:18,border:"none",background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,color:"white",fontSize:15,fontWeight:800,cursor:"pointer",boxShadow:`0 6px 20px ${C.primary}50`,letterSpacing:0.3}}>
          {T.proSubscribe} — {selectedPlan.final.toLocaleString()} so'm
          {selectedPlan.saved > 0 && ` (−${selectedPlan.saved.toLocaleString()})`}
        </button>

        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginTop:12}}>
          <IC.ShieldCheck size={14} color={C.success}/>
          <span style={{fontSize:11,color:C.subtext}}>{T.proCancel}</span>
        </div>
      </div>
    </div>
  );
}
// ─── NOTIFICATIONS DATA ───
const INIT_NOTIFS = [
  {id:1, type:"exam",   read:false, time:2,  titleKey:"notifExam",  body:{uz:"Bugun imtihon rejalashtirgan edingiz!",             ru:"Сегодня вы планировали сдать экзамен!",          kril:"Бугун имтиҳон режалаштирган эдингиз!"}},
  {id:2, type:"result", read:false, time:15, titleKey:"notifResult", body:{uz:"Bilet 5 dan 90% natija oldingiz 🎉",                ru:"Вы набрали 90% за Билет 5 🎉",                   kril:"Билет 5 дан 90% натижа олдингиз 🎉"}},
  {id:3, type:"new",    read:false, time:60, titleKey:"notifNew",   body:{uz:"Bilet 23 yangilandi. Ko'rib chiqing!",               ru:"Билет 23 обновлён. Проверьте!",                  kril:"Билет 23 янгиланди. Кўриб чиқинг!"}},
  {id:4, type:"daily",  read:true,  time:120,titleKey:"notifDaily", body:{uz:"Kunlik maqsadingiz: 150 savol. Hali 80 ta qoldi.",   ru:"Ваша дневная цель: 150 вопросов. Осталось 80.", kril:"Кунлик мақсадингиз: 150 савол. Яна 80 та қолди."}},
  {id:5, type:"result", read:true,  time:180,titleKey:"notifResult",body:{uz:"Test seriyangiz 12 ga yetdi. Zo'r!",                 ru:"Ваша серия достигла 12. Отлично!",               kril:"Тест серияngиз 12 га етди. Зўр!"}},
  {id:6, type:"new",    read:true,  time:300,titleKey:"notifNew",   body:{uz:"5 ta yangi bilet qo'shildi. Sinab ko'ring!",         ru:"Добавлено 5 новых билетов. Попробуйте!",         kril:"5 та янги билет қўшилди. Синаб кўринг!"}},
  {id:7, type:"daily",  read:true,  time:1440,titleKey:"notifDaily",body:{uz:"Kecha 3 ta bilet yakundingiz. Bugun davom eting!",   ru:"Вчера вы завершили 3 билета. Продолжайте!",      kril:"Кеча 3 та билет якундингиз. Бугун давом этинг!"}},
];

const NOTIF_ICONS = {
  exam:   { Icon: IC.Clock,         bg:"#EBF2FF", color:"#1A6BFF" },
  result: { Icon: IC.CheckCircle,   bg:"#DCFCE7", color:"#22C55E" },
  new:    { Icon: IC.Ticket,        bg:"#FEF3C7", color:"#F59E0B" },
  daily:  { Icon: IC.Bell,          bg:"#F5F3FF", color:"#8B5CF6" },
};

// ─── TOAST ───
function Toast({toasts}) {
  return (
    <div style={{position:"fixed",top:16,left:16,right:16,width:"calc(100% - 32px)",zIndex:999,pointerEvents:"none",display:"flex",flexDirection:"column",gap:8}}>
      {toasts.map(t=>(
        <div key={t.id} style={{background:t.type==="success"?"#22C55E":t.type==="error"?"#EF4444":"#1A6BFF",color:"white",borderRadius:14,padding:"13px 16px",display:"flex",alignItems:"center",gap:10,boxShadow:"0 8px 24px rgba(0,0,0,0.25)",animation:"slideDown 0.3s ease"}}>
          {t.type==="success"&&<IC.CheckCircle size={18} color="white"/>}
          {t.type==="error"&&<IC.XCircle size={18} color="white"/>}
          {t.type==="info"&&<IC.Bell size={18} color="white"/>}
          <span style={{fontWeight:600,fontSize:14}}>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

// ─── SEARCH SCREEN ───
function SearchScreen({setScreen,setActiveTicket,T,C,lang,savedQuestions}) {
  const [query,setQuery]=useState("");
  const [filter,setFilter]=useState("all");
  const inputRef=useRef();

  const highlight=(text,q)=>{
    if(!q||!text) return text;
    const str=String(text);
    const idx=str.toLowerCase().indexOf(q.toLowerCase());
    if(idx===-1) return str;
    return <span>{str.slice(0,idx)}<mark style={{background:C.primary+"33",color:C.primary,borderRadius:3,padding:"0 1px",fontWeight:700}}>{str.slice(idx,idx+q.length)}</mark>{str.slice(idx+q.length)}</span>;
  };

  // Build all searchable data
  const allTickets=tickets.slice(0,20).map((t,i)=>({
    type:"ticket", id:t.id,
    title:`Bilet ${t.id}`,
    sub:`20 ${T.questions}`,
    progress:[95,90,80,100,75,null,null,null,null,null,88,null,null,null,null,null,null,null,null,null][i],
  }));

  const allQuestions=tickets.slice(0,10).flatMap(t=>
    t.questions.slice(0,5).map(q=>({
      type:"question", ticketId:t.id, questionId:q.id,
      title:getQ(q.question,lang),
      sub:`${T.ticket} ${t.id} · #${q.id}`,
      question:q.question, sign:q.sign, options:q.options, correct:q.correct,
      key:`${t.id}-${q.id}`
    }))
  );

  const allSigns=SIGNS_CATEGORIES.flatMap((cat,ci)=>
    cat.items.map((item,ji)=>({
      type:"sign", key:`rules-${ci}-${ji}`,
      title:item[lang]||item.uz,
      sub:cat.title[lang]||cat.title.uz,
      catColor:cat.color, catBg:cat.bg, catIcon:cat.icon,
    }))
  );

  const savedItems=savedQuestions.map(s=>({
    type:"saved", key:s.key,
    title:typeof s.question==="object"?(s.question[lang]||s.question.uz):s.question,
    sub:s.ticketId==="rules"?"🚦 Yo'l qoidasi":`${T.ticket} ${s.ticketId}`,
    isRule:s.ticketId==="rules",
  }));

  const q=query.trim().toLowerCase();

  const match=(item)=> q.length<2 ? false :
    (item.title||"").toLowerCase().includes(q)||
    (item.sub||"").toLowerCase().includes(q)||
    (item.type==="ticket"&&`bilet ${item.id}`.includes(q))||
    (item.type==="ticket"&&String(item.id)===q);

  const ticketResults  = (filter==="all"||filter==="tickets")   ? allTickets.filter(match)   : [];
  const questionResults= (filter==="all"||filter==="questions") ? allQuestions.filter(match) : [];
  const signResults    = (filter==="all"||filter==="signs")     ? allSigns.filter(match)     : [];
  const savedResults   = (filter==="all"||filter==="saved")     ? savedItems.filter(match)   : [];
  const total=ticketResults.length+questionResults.length+signResults.length+savedResults.length;

  const popular=[
    {label:"Piyoda yo'li",  q:"piyoda"},
    {label:"60 km/s",       q:"60"},
    {label:"To'xtash",      q:"to'xtash"},
    {label:"Signal",        q:"signal"},
    {label:"Bilet 1",       q:"bilet 1"},
  ];

  const filters=[
    ["all",T.filterAll],
    ["tickets",T.filterTickets],
    ["questions",T.filterQuestions],
    ["signs","Belgilar"],
    ["saved",T.savedQ],
  ];

  const ResultCard=({children,onClick})=>(
    <div onClick={onClick} style={{background:C.card,borderRadius:14,padding:"13px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:12,border:`1px solid ${C.cardBorder}`,cursor:"pointer",transition:"box-shadow 0.15s"}}>
      {children}
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:C.bg}}>
      {/* Header */}
      <div style={{background:C.card,padding:"52px 16px 12px",borderBottom:`1px solid ${C.gray200}`,boxShadow:`0 2px 12px rgba(0,0,0,0.06)`}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>setScreen("home")} style={{width:36,height:36,borderRadius:12,background:C.gray100,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <IC.ArrowLeft size={16} color={C.text}/>
          </button>
          <div style={{flex:1,display:"flex",alignItems:"center",gap:10,background:C.inputBg,borderRadius:14,padding:"10px 14px",border:`1.5px solid ${query?C.primary:C.gray200}`,transition:"border 0.2s"}}>
            <IC.Search size={16} color={query?C.primary:C.gray400}/>
            <input ref={inputRef} autoFocus value={query} onChange={e=>setQuery(e.target.value)}
              placeholder={T.searchPlaceholder}
              style={{flex:1,border:"none",background:"transparent",fontSize:14,outline:"none",color:C.text}}/>
            {query&&<button onClick={()=>setQuery("")} style={{background:"none",border:"none",cursor:"pointer",padding:0,display:"flex"}}>
              <IC.XCircle size={16} color={C.gray400}/>
            </button>}
          </div>
        </div>
        {/* Filter chips */}
        <div style={{display:"flex",gap:6,marginTop:12,overflowX:"auto",paddingBottom:2}}>
          {filters.map(([id,label])=>(
            <button key={id} onClick={()=>setFilter(id)}
              style={{padding:"6px 12px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:filter===id?C.primary:C.gray100,color:filter===id?"white":C.subtext,whiteSpace:"nowrap",transition:"all 0.2s",flexShrink:0}}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{padding:16}}>
        {/* Empty — show popular */}
        {q.length<2&&(
          <>
            <div style={{fontSize:11,fontWeight:700,color:C.subtext,marginBottom:10,letterSpacing:"0.5px",textTransform:"uppercase"}}>{T.searchHint||"Tez qidiruv"}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:20}}>
              {popular.map(p=>(
                <button key={p.q} onClick={()=>setQuery(p.q)}
                  style={{padding:"7px 14px",borderRadius:20,border:`1.5px solid ${C.gray200}`,background:C.card,color:C.text,fontSize:13,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
                  <IC.Search size={12} color={C.gray400}/>{p.label}
                </button>
              ))}
            </div>
            {savedQuestions.length>0&&(
              <>
                <div style={{fontSize:11,fontWeight:700,color:C.subtext,marginBottom:10,letterSpacing:"0.5px",textTransform:"uppercase"}}>{T.savedQ}</div>
                {savedQuestions.slice(0,3).map(s=>{
                  const title=typeof s.question==="object"?(s.question[lang]||s.question.uz):s.question;
                  return (
                  <ResultCard key={s.key} onClick={()=>setScreen("saved")}>
                    <div style={{width:36,height:36,borderRadius:11,background:"#FEF3C7",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <IC.Bookmark size={16} color="#F59E0B"/>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:600,color:C.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{title}</div>
                      <div style={{fontSize:11,color:C.subtext}}>{s.ticketId==="rules"?<span style={{display:"flex",alignItems:"center",gap:4}}><IC.Traffic size={11} color={C.subtext}/>Yo'l qoidasi</span>:`${T.ticket} ${s.ticketId}`}</div>
                    </div>
                    <IC.ChevronRight size={14} color={C.gray400}/>
                  </ResultCard>
                );})}
              </>
            )}
          </>
        )}

        {/* Results */}
        {q.length>=2&&(
          <>
            {total===0?(
              <div style={{textAlign:"center",padding:"50px 20px"}}>
                <div style={{width:64,height:64,borderRadius:"50%",background:C.gray200,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
                  <IC.Search size={28} color={C.gray400}/>
                </div>
                <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:6}}>{T.noResults}</div>
                <div style={{fontSize:13,color:C.subtext}}>«{query}»</div>
              </div>
            ):(
              <>
                <div style={{fontSize:12,color:C.subtext,marginBottom:14,fontWeight:500}}>{total} {T.searchResults||"natija"}</div>

                {/* Tickets */}
                {ticketResults.length>0&&(
                  <div style={{marginBottom:16}}>
                    <div style={{fontSize:11,fontWeight:700,color:C.subtext,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.5px"}}>{T.filterTickets}</div>
                    {ticketResults.map(item=>(
                      <ResultCard key={item.id} onClick={()=>{const t=tickets.find(x=>x.id===item.id);setActiveTicket(t);setScreen("ticket-quiz");}}>
                        <div style={{width:38,height:38,borderRadius:12,background:C.primary+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontWeight:800,fontSize:13,color:C.primary}}>B{item.id}</div>
                        <div style={{flex:1}}>
                          <div style={{fontWeight:700,fontSize:14,color:C.text}}>{highlight(item.title,query)}</div>
                          <div style={{fontSize:11,color:C.subtext}}>{item.sub}</div>
                        </div>
                        {item.progress!=null
                          ?<div style={{background:item.progress>=80?C.success+"18":C.warning+"18",borderRadius:20,padding:"3px 8px",fontSize:11,fontWeight:700,color:item.progress>=80?C.success:C.warning}}>{item.progress}%</div>
                          :<IC.ChevronRight size={14} color={C.gray400}/>}
                      </ResultCard>
                    ))}
                  </div>
                )}

                {/* Questions */}
                {questionResults.length>0&&(
                  <div style={{marginBottom:16}}>
                    <div style={{fontSize:11,fontWeight:700,color:C.subtext,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.5px"}}>{T.filterQuestions}</div>
                    {questionResults.map((item,i)=>(
                      <ResultCard key={item.key||i}>
                        <div style={{width:36,height:36,borderRadius:11,background:C.primary+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          <IC.FileText size={16} color={C.primary}/>
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:13,fontWeight:600,color:C.text,lineHeight:1.4,marginBottom:2}}>{highlight(item.title,query)}</div>
                          <div style={{fontSize:11,color:C.subtext}}>{item.sub}</div>
                        </div>
                      </ResultCard>
                    ))}
                  </div>
                )}

                {/* Road signs */}
                {signResults.length>0&&(
                  <div style={{marginBottom:16}}>
                    <div style={{fontSize:11,fontWeight:700,color:C.subtext,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.5px"}}>Yo'l belgilari</div>
                    {signResults.map((item,i)=>(
                      <ResultCard key={item.key||i} onClick={()=>setScreen("rules")}>
                        <div style={{width:36,height:36,borderRadius:11,background:item.catBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:18}}>{item.catIcon}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:13,fontWeight:600,color:C.text,lineHeight:1.4,marginBottom:2}}>{highlight(item.title,query)}</div>
                          <div style={{fontSize:11,color:C.subtext}}>{item.sub}</div>
                        </div>
                        <IC.ChevronRight size={14} color={C.gray400}/>
                      </ResultCard>
                    ))}
                  </div>
                )}

                {/* Saved */}
                {savedResults.length>0&&(
                  <div style={{marginBottom:16}}>
                    <div style={{fontSize:11,fontWeight:700,color:C.subtext,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.5px"}}>{T.savedQ}</div>
                    {savedResults.map((item,i)=>(
                      <ResultCard key={item.key||i} onClick={()=>setScreen("saved")}>
                        <div style={{width:36,height:36,borderRadius:11,background:"#FEF3C7",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          <IC.Bookmark size={16} color="#F59E0B"/>
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:13,fontWeight:600,color:C.text,lineHeight:1.4,marginBottom:2}}>{highlight(item.title,query)}</div>
                          <div style={{fontSize:11,color:C.subtext}}>{item.sub}</div>
                        </div>
                        <IC.ChevronRight size={14} color={C.gray400}/>
                      </ResultCard>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── SAVED QUESTIONS SCREEN ───
function SavedQuestionsScreen({setScreen,savedQuestions,setSavedQuestions,T,C,lang,addToast,setActiveTicket,prevScreen}) {
  const [practiceMode,setPracticeMode]=useState(false);
  const [current,setCurrent]=useState(0);
  const [selected,setSelected]=useState(null);
  const [results,setResults]=useState({});

  const removeOne=(key)=>{
    setSavedQuestions(savedQuestions.filter(s=>s.key!==key));
    addToast(T.bookmarkRemoved,"info");
  };

  const clearAll=()=>{
    setSavedQuestions([]);
    addToast(T.bookmarkRemoved,"info");
  };

  // Practice mode
  if(practiceMode && savedQuestions.length>0){
    const q=savedQuestions[current];
    const isSel=selected!==null;
    const handleAns=(i)=>{
      setSelected(i);
      setResults({...results,[current]:i});
    };
    return <div style={{minHeight:"100vh",background:C.white}}>
      <div style={{...SC.header(C),padding:"50px 20px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <button onClick={()=>{setPracticeMode(false);setCurrent(0);setSelected(null);setResults({});}} style={{background:"rgba(255,255,255,0.2)",border:"none",width:36,height:36,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><IC.ArrowLeft size={18} color="white"/></button>
          <div style={{color:"white",fontWeight:700,fontSize:15}}>{T.savedQ}</div>
          <div style={{background:"rgba(255,255,255,0.2)",borderRadius:10,padding:"6px 12px"}}>
            <span style={{color:"white",fontWeight:700,fontSize:14}}>{current+1}/{savedQuestions.length}</span>
          </div>
        </div>
        <div style={{display:"flex",gap:3}}>{savedQuestions.map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:100,background:results[i]!==undefined?"white":i===current?"rgba(255,255,255,0.7)":"rgba(255,255,255,0.25)"}}/>)}</div>
      </div>
      <div style={{padding:20}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <div style={{background:q.ticketId==="rules"?"#DCFCE7":C.primary+"22",borderRadius:8,padding:"4px 10px"}}>
            <span style={{fontSize:11,fontWeight:700,color:q.ticketId==="rules"?"#22C55E":C.primary}}>
              {q.ticketId==="rules"?<span style={{display:"flex",alignItems:"center",gap:4}}><IC.Traffic size={11} color={C.subtext}/>Yo'l qoidasi</span>:`${T.ticket} ${q.ticketId} · #${q.questionId}`}
            </span>
          </div>
          <IC.Bookmark size={16} color="#FFD700"/>
        </div>
        <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:20,lineHeight:1.5}}>
          {typeof q.question==="object"?(q.question[lang]||q.question.uz):getQ(q.question,lang)}
        </div>
        {q.image&&<div style={{marginBottom:20}}><img src={q.image} alt="" style={{width:"100%",maxHeight:200,objectFit:"contain",borderRadius:16,background:C.gray100}}/></div>}
        {getSignType(q.sign)&&<div style={{textAlign:"center",marginBottom:20,background:"linear-gradient(135deg,#FEF3C7,#FDE68A)",borderRadius:20,padding:16}}><SignSVG type={getSignType(q.sign)}/></div>}
        {q.ticketId!=="rules"&&q.options&&<OptionsList options={getOpts(q.options,lang)} correct={q.correct} selected={selected} onSelect={handleAns} C={C}/>}
        {isSel&&(
          <div style={{background:selected===q.correct?"#DCFCE7":"#FEE2E2",borderRadius:14,padding:"12px 16px",marginTop:4,display:"flex",alignItems:"center",gap:10}}>
            {selected===q.correct?<IC.CheckCircle size={18} color="#22C55E"/>:<IC.XCircle size={18} color="#EF4444"/>}
            <span style={{fontWeight:600,fontSize:14,color:selected===q.correct?"#22C55E":"#EF4444"}}>{selected===q.correct?T.correct:T.wrong}</span>
          </div>
        )}
        <div style={{display:"flex",gap:12,marginTop:20}}>
          <Btn C={C} variant="outline" onClick={()=>{if(current>0){setCurrent(current-1);setSelected(results[current-1]??null);}}} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6}} disabled={current===0}><IC.ArrowLeft size={16} color={C.primary}/>{T.back}</Btn>
          {current<savedQuestions.length-1
            ? <Btn C={C} onClick={()=>{setCurrent(current+1);setSelected(results[current+1]??null);}} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>{T.next}<IC.ArrowRight size={16} color="white"/></Btn>
            : <Btn C={C} onClick={()=>{setPracticeMode(false);setCurrent(0);setSelected(null);setResults({});}} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><IC.CheckCircle size={15} color="white"/>Tugatish</Btn>
          }
        </div>
      </div>
    </div>;
  }

  return <div style={{minHeight:"100vh",background:C.bg}}>
    {/* Header */}
    <div style={{background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,padding:"52px 20px 24px"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
        <button onClick={()=>setScreen(prevScreen||"profile")} style={{background:"rgba(255,255,255,0.2)",border:"none",width:36,height:36,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><IC.ArrowLeft size={18} color="white"/></button>
        <div>
          <h2 style={{color:"white",fontSize:20,fontWeight:800,margin:0}}>{T.savedQ}</h2>
        </div>
      </div>
    </div>

    <div style={{padding:16}}>
      {savedQuestions.length===0 ? (
        <div style={{textAlign:"center",padding:"60px 20px"}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:C.gray200,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
            <IC.Bookmark size={36} color={C.gray400}/>
          </div>
          <div style={{fontWeight:700,fontSize:18,color:C.text,marginBottom:8}}>{T.savedEmpty}</div>
        </div>
      ) : (
        <>
          {/* Practice & Clear buttons */}
          <div style={{display:"flex",gap:10,marginBottom:16}}>
            <button onClick={()=>setPracticeMode(true)} style={{flex:1,background:C.primary,color:"white",border:"none",borderRadius:14,padding:"13px",fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <IC.Clipboard size={16} color="white"/>{T.practiceAll}
            </button>
            <button onClick={clearAll} style={{background:C.danger+"22",color:C.danger,border:`1.5px solid ${C.danger}33`,borderRadius:14,padding:"13px 16px",fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
              <IC.XCircle size={16} color={C.danger}/>
            </button>
          </div>

          {/* Question/Sign cards */}
          {savedQuestions.map((q,idx)=>{
            const isRule=q.ticketId==="rules";
            const questionText=typeof q.question==="object"?(q.question[lang]||q.question.uz):q.question;
            return (
            <div key={q.key} style={{background:C.card,borderRadius:16,padding:"14px 16px",marginBottom:12,boxShadow:"0 2px 10px rgba(0,0,0,0.07)",border:`1px solid ${C.cardBorder}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{background:isRule?"#DCFCE7":"#FEF3C7",borderRadius:8,padding:"4px 10px"}}>
                    <span style={{fontSize:11,fontWeight:700,color:isRule?"#22C55E":"#F59E0B"}}>
                      {isRule?<span style={{display:"flex",alignItems:"center",gap:4}}><IC.Traffic size={11} color={C.subtext}/>Yo'l qoidasi</span>:`${T.ticket} ${q.ticketId}`}
                    </span>
                  </div>
                  {!isRule&&<span style={{fontSize:11,color:C.subtext}}>#{q.questionId}</span>}
                </div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <IC.Bookmark size={16} color="#F59E0B"/>
                  <button onClick={()=>removeOne(q.key)} style={{background:C.danger+"18",border:"none",borderRadius:8,width:28,height:28,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <IC.XCircle size={14} color={C.danger}/>
                  </button>
                </div>
              </div>
              <p style={{margin:"0 0 12px",fontSize:14,fontWeight:600,color:C.text,lineHeight:1.5}}>{questionText}</p>
              {getSignType(q.sign)&&<div style={{background:"#FEF3C7",borderRadius:12,padding:"10px",marginBottom:10,display:"flex",justifyContent:"center"}}><SignSVG type={getSignType(q.sign)}/></div>}
              {!isRule&&q.options&&(
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {getOpts(q.options,lang).map((opt,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:10,background:i===q.correct?C.success+"18":C.gray100,border:`1.5px solid ${i===q.correct?C.success+"44":"transparent"}`}}>
                      <div style={{width:20,height:20,borderRadius:"50%",background:i===q.correct?C.success:C.gray300,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"white",flexShrink:0}}>{String.fromCharCode(65+i)}</div>
                      <span style={{fontSize:13,color:i===q.correct?C.success:C.subtext,fontWeight:i===q.correct?600:400}}>{opt}</span>
                      {i===q.correct&&<IC.CheckCircle size={14} color={C.success} style={{marginLeft:"auto"}}/>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );})}

        </>
      )}
    </div>
  </div>;
}

// ─── NOTIFICATIONS SCREEN ───
function NotificationsScreen({setScreen,notifs,setNotifs,notifSettings,setNotifSettings,T,C,lang}) {
  const [tab,setTab]=useState("all");
  const [showSettings,setShowSettings]=useState(false);

  // Filter notifs by both tab AND settings
  const visibleNotifs=notifs.filter(n=>{
    if(!notifSettings[n.type]) return false;
    if(tab==="unread") return !n.read;
    return true;
  });
  const unreadCount=notifs.filter(n=>!n.read&&notifSettings[n.type]).length;

  const markAll=()=>setNotifs(notifs.map(n=>({...n,read:true})));
  const markOne=(id)=>setNotifs(notifs.map(n=>n.id===id?{...n,read:true}:n));
  const deleteOne=(id)=>setNotifs(notifs.filter(n=>n.id!==id));

  const timeLabel=(mins)=>{
    if(mins<1) return T.justNow;
    if(mins<60) return `${mins} ${T.minsAgo}`;
    if(mins<1440) return `${Math.floor(mins/60)} ${T.hoursAgo}`;
    return `${Math.floor(mins/1440)} ${T.daysAgo}`;
  };

  const settingsList=[
    {key:"daily",  lk:"notifDaily",  desc:{uz:"Kunlik maqsad va eslatmalar",ru:"Ежедневные цели и напоминания",kril:"Кунлик мақсад ва эслатмалар"}},
    {key:"result", lk:"notifResult", desc:{uz:"Test va bilet natijalari",ru:"Результаты тестов и билетов",kril:"Тест ва билет натижалари"}},
    {key:"new",    lk:"notifNew",    desc:{uz:"Yangi biletlar va savollar",ru:"Новые билеты и вопросы",kril:"Янги билетлар ва саволлар"}},
    {key:"exam",   lk:"notifExam",   desc:{uz:"Imtihon eslatmalari",ru:"Напоминания об экзамене",kril:"Имтиҳон эслатмалари"}},
  ];

  const enabledCount=Object.values(notifSettings).filter(Boolean).length;

  // Settings panel
  if(showSettings) return (
    <div style={{minHeight:"100vh",background:C.bg}}>
      <div style={{background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,padding:"52px 20px 24px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={()=>setShowSettings(false)} style={{background:"rgba(255,255,255,0.2)",border:"none",width:36,height:36,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <IC.ArrowLeft size={18} color="white"/>
          </button>
          <div>
            <h2 style={{color:"white",fontSize:20,fontWeight:800,margin:0}}>{T.notifSettings}</h2>
            <p style={{color:"rgba(255,255,255,0.75)",fontSize:12,margin:0}}>{enabledCount}/4 {T.notifOn||"yoqilgan"}</p>
          </div>
        </div>
      </div>
      <div style={{padding:16}}>
        {/* Master toggle */}
        <Card C={C} style={{marginBottom:16,padding:"16px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:42,height:42,borderRadius:14,background:enabledCount>0?C.primary+"18":C.gray100,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <IC.Bell size={20} color={enabledCount>0?C.primary:C.gray400}/>
              </div>
              <div>
                <div style={{fontWeight:700,fontSize:14,color:C.text}}>Barcha bildirishnomalar</div>
                <div style={{fontSize:12,color:C.subtext}}>{enabledCount>0?`${enabledCount} ta yoqilgan`:"Hammasi o'chirilgan"}</div>
              </div>
            </div>
            <div onClick={()=>{
              const allOn=enabledCount===4;
              const newS={daily:!allOn,result:!allOn,new:!allOn,exam:!allOn};
              setNotifSettings(newS);
            }} style={{width:48,height:26,borderRadius:13,background:enabledCount>0?C.primary:C.gray300,cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}>
              <div style={{position:"absolute",top:3,left:enabledCount>0?22:3,width:20,height:20,borderRadius:"50%",background:"white",transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)"}}/>
            </div>
          </div>
        </Card>

        <div style={{fontSize:11,fontWeight:700,color:C.subtext,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.5px"}}>Bildirishnoma turlari</div>
        {settingsList.map(s=>(
          <Card key={s.key} C={C} style={{marginBottom:10,padding:"14px 16px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:40,height:40,borderRadius:12,background:notifSettings[s.key]?(NOTIF_ICONS[s.key]?.bg||"#EEE"):C.gray100,display:"flex",alignItems:"center",justifyContent:"center",transition:"background 0.2s"}}>
                  {s.key==="daily"&&<IC.Bell size={18} color={notifSettings[s.key]?"#8B5CF6":C.gray400}/>}
                  {s.key==="result"&&<IC.CheckCircle size={18} color={notifSettings[s.key]?"#22C55E":C.gray400}/>}
                  {s.key==="new"&&<IC.Ticket size={18} color={notifSettings[s.key]?"#F59E0B":C.gray400}/>}
                  {s.key==="exam"&&<IC.Clock size={18} color={notifSettings[s.key]?"#1A6BFF":C.gray400}/>}
                </div>
                <div>
                  <div style={{fontWeight:600,fontSize:14,color:notifSettings[s.key]?C.text:C.gray400,transition:"color 0.2s"}}>{T[s.lk]}</div>
                  <div style={{fontSize:11,color:C.subtext,marginTop:1}}>{s.desc[lang]||s.desc.uz}</div>
                </div>
              </div>
              <div onClick={()=>setNotifSettings({...notifSettings,[s.key]:!notifSettings[s.key]})}
                style={{width:48,height:26,borderRadius:13,background:notifSettings[s.key]?C.success:C.gray300,cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}>
                <div style={{position:"absolute",top:3,left:notifSettings[s.key]?22:3,width:20,height:20,borderRadius:"50%",background:"white",transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)"}}/>
              </div>
            </div>
          </Card>
        ))}

        {/* Info */}
        <div style={{marginTop:8,background:C.primary+"10",borderRadius:14,padding:"12px 16px",display:"flex",gap:10,alignItems:"flex-start"}}>
          <IC.Info size={16} color={C.primary} style={{flexShrink:0,marginTop:1}}/>
          <p style={{margin:0,fontSize:12,color:C.subtext,lineHeight:1.6}}>
            O'chirilgan tur bildirishnomalari ro'yxatda ko'rinmaydi va yangilari ham qo'shilmaydi.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:C.bg}}>
      {/* Header */}
      <div style={SC.header(C)}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <button onClick={()=>setScreen("home")} style={{background:"rgba(255,255,255,0.2)",border:"none",width:36,height:36,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <IC.ArrowLeft size={18} color="white"/>
            </button>
            <div>
              <h2 style={{color:"white",fontSize:20,fontWeight:800,margin:0}}>{T.notifications}</h2>
              {unreadCount>0&&<p style={{color:"rgba(255,255,255,0.75)",fontSize:12,margin:0}}>{unreadCount} {T.notifUnread}</p>}
            </div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {unreadCount>0&&(
              <button onClick={markAll} style={{background:"transparent",border:"none",padding:"8px 4px",cursor:"pointer",display:"flex",alignItems:"center"}}>
                <svg width="28" height="18" viewBox="0 0 28 18" fill="none">
                  <polyline points="1,9 6,14 14,4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="8,9 13,14 27,4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
            <button onClick={()=>setShowSettings(true)} style={{background:"rgba(255,255,255,0.2)",border:"none",width:36,height:36,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
              <IC.Settings size={18} color="white"/>
              {enabledCount<4&&<div style={{position:"absolute",top:6,right:6,width:8,height:8,borderRadius:"50%",background:"#F59E0B",border:"1.5px solid white"}}/>}
            </button>
          </div>
        </div>
        <div style={{display:"flex",gap:8,marginTop:16}}>
          {[["all",T.notifAll],["unread",T.notifUnread]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{padding:"7px 16px",borderRadius:20,border:"none",cursor:"pointer",background:tab===id?"white":"rgba(255,255,255,0.2)",color:tab===id?C.primary:"white",fontSize:13,fontWeight:600}}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{padding:16}}>
        {/* O'chirilgan turlar haqida xabar */}
        {enabledCount<4&&(
          <div onClick={()=>setShowSettings(true)} style={{background:C.warning+"18",borderRadius:14,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:10,cursor:"pointer",border:`1px solid ${C.warning}33`}}>
            <IC.Bell size={16} color={C.warning}/>
            <span style={{fontSize:12,color:C.text,flex:1}}>{4-enabledCount} turdagi bildirishnoma o'chirilgan</span>
            <IC.ChevronRight size={14} color={C.warning}/>
          </div>
        )}

        {visibleNotifs.length===0 ? (
          <div style={{textAlign:"center",padding:"60px 20px"}}>
            <div style={{width:72,height:72,borderRadius:"50%",background:C.gray200,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
              <IC.Bell size={32} color={C.gray400}/>
            </div>
            <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:6}}>{T.notifEmpty}</div>
          </div>
        ) : (
          visibleNotifs.map(n=>{
            const ni=NOTIF_ICONS[n.type]||NOTIF_ICONS.daily;
            return (
              <div key={n.id} onClick={()=>markOne(n.id)} style={{background:n.read?C.card:C.primary+"0D",borderRadius:16,padding:"14px 14px",marginBottom:10,display:"flex",alignItems:"flex-start",gap:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)",cursor:"pointer",border:`1px solid ${n.read?C.cardBorder:C.primary+"33"}`,position:"relative"}}>
                <div style={{width:44,height:44,borderRadius:14,background:ni.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <ni.Icon size={20} color={ni.color}/>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3}}>
                    <span style={{fontWeight:700,fontSize:13,color:C.text}}>{n.title ? (n.title[lang]||n.title.uz) : T[n.titleKey]}</span>
                    <span style={{fontSize:11,color:C.subtext,flexShrink:0,marginLeft:8}}>{timeLabel(n.time)}</span>
                  </div>
                  <p style={{margin:0,fontSize:13,color:C.subtext,lineHeight:1.5}}>{n.body[lang]||n.body.uz}</p>
                </div>
                {!n.read&&<div style={{position:"absolute",top:14,right:14,width:8,height:8,borderRadius:"50%",background:C.primary}}/>}
                <button onClick={e=>{e.stopPropagation();deleteOne(n.id);}} style={{position:"absolute",bottom:10,right:12,background:"none",border:"none",cursor:"pointer",padding:2,display:"flex",alignItems:"center"}}>
                  <IC.XCircle size={14} color={C.gray400}/>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── TOPICS SCREEN ───
const TOPICS_DATA = [
  { id:"t1",  icon:"traffic", title:{uz:"Svetoforlar",ru:"Светофоры",kril:"Светофорлар"}, count:12, color:"#1A6BFF", bg:"#EBF2FF" },
  { id:"t2",  icon:"roadsign", title:{uz:"Yo'l belgilari",ru:"Дорожные знаки",kril:"Йўл белгилари"}, count:28, color:"#22C55E", bg:"#DCFCE7" },
  { id:"t3",  icon:"refresh", title:{uz:"Harakatlanish tartibi",ru:"Порядок движения",kril:"Ҳаракатланиш тартиби"}, count:20, color:"#F59E0B", bg:"#FEF3C7" },
  { id:"t4",  icon:"refresh", title:{uz:"Kesishmalar",ru:"Перекрёстки",kril:"Кесишмалар"}, count:15, color:"#8B5CF6", bg:"#F5F3FF" },
  { id:"t5",  icon:"walk", title:{uz:"Piyodalar",ru:"Пешеходы",kril:"Пиёдалар"}, count:10, color:"#EC4899", bg:"#FCE7F3" },
  { id:"t6",  icon:"weather", title:{uz:"Ob-havo sharoiti",ru:"Погодные условия",kril:"Об-ҳаво шароити"}, count:8, color:"#0EA5E9", bg:"#E0F2FE" },
  { id:"t7",  icon:"speed", title:{uz:"Tezlik chegarasi",ru:"Скорость",kril:"Тезлик чегараси"}, count:9, color:"#EF4444", bg:"#FEE2E2" },
  { id:"t8",  icon:"mandatory", title:{uz:"To'xtash va turish",ru:"Остановка и стоянка",kril:"Тўхташ ва туриш"}, count:11, color:"#F97316", bg:"#FFEDD5" },
  { id:"t9",  icon:"ambulance", title:{uz:"Maxsus transport",ru:"Спецтранспорт",kril:"Махсус транспорт"}, count:6, color:"#14B8A6", bg:"#CCFBF1" },
  { id:"t10", icon:"wrench", title:{uz:"Texnik holat",ru:"Техническое состояние",kril:"Техник ҳолат"}, count:7, color:"#6366F1", bg:"#EEF2FF" },
];

function TopicsScreen({setScreen,T,C,lang}) {
  return (
    <div style={{minHeight:"100vh",background:C.bg}}>
      <div style={{background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,padding:"52px 20px 24px"}}>
        <h2 style={{color:"white",fontSize:22,fontWeight:800,margin:0}}>{T.topicsTitle}</h2>
        <p style={{color:"rgba(255,255,255,0.7)",fontSize:13,margin:"4px 0 0"}}>{T.topicsSub}</p>
      </div>
      <div style={{padding:16,display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {TOPICS_DATA.map((topic,i)=>{
          const taggedCount = tickets.reduce((sum,t)=>sum+t.questions.filter(q=>q.topicIndex===i).length,0);
          return (
          <div key={i} style={{background:C.card,borderRadius:18,padding:16,cursor:"pointer",border:`1px solid ${C.cardBorder}`,boxShadow:"0 1px 6px rgba(0,0,0,0.05)",transition:"transform 0.15s"}}>
            <div style={{width:44,height:44,borderRadius:14,background:topic.bg,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}>
              <TopicIcon icon={topic.icon} size={22} color={topic.color}/>
            </div>
            <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:4,lineHeight:1.3}}>
              {topic.title[lang]||topic.title.uz}
            </div>
            <div style={{fontSize:11,color:topic.color,fontWeight:600}}>
              {taggedCount} {T.questions}
            </div>
            <div style={{marginTop:8,height:4,background:C.gray200,borderRadius:100}}>
              <div style={{height:"100%",width:`${[65,40,0,80,55,0,30,70,0,45][i]||0}%`,background:topic.color,borderRadius:100}}/>
            </div>
          </div>
        );})}
      </div>
    </div>
  );
}

// ─── RULES SCREEN ───
const SIGNS_CATEGORIES = [
  {
    id:"info",
    icon:"ℹ️",
    color:"#0EA5E9", bg:"#E0F2FE",
    title:{uz:"Axborot belgilari",ru:"Информационные знаки",kril:"Ахборот белгилари"},
    desc:{uz:"Yo'l sharoiti va harakat tartibi haqida ma'lumot beruvchi belgilar",ru:"Знаки, информирующие об условиях движения",kril:"Йўл шароити ва ҳаракат тартиби ҳақида маълумот берувчи белгилар"},
    count:34,
    items:[
      {uz:"5.1 — Avtomobil yo'li boshlanishi",ru:"5.1 — Начало автомобильной дороги",kril:"5.1 — Автомобил йўли бошланиши"},
      {uz:"5.3 — Bir tomonlama harakat boshlanishi",ru:"5.3 — Начало одностороннего движения",kril:"5.3 — Бир томонлама ҳаракат бошланиши"},
      {uz:"5.5 — Piyodalar yo'lkasi",ru:"5.5 — Пешеходная дорожка",kril:"5.5 — Пиёдалар йўлкаси"},
      {uz:"5.7 — Velosiped yo'lkasi",ru:"5.7 — Велосипедная дорожка",kril:"5.7 — Велосипед йўлкаси"},
      {uz:"5.11 — Aholi punkti boshlanishi",ru:"5.11 — Начало населённого пункта",kril:"5.11 — Аҳоли пункти бошланиши"},
      {uz:"5.15 — To'g'ri va chapga harakat yo'nalishi",ru:"5.15 — Направление движения прямо и налево",kril:"5.15 — Тўғри ва чапга ҳаракат йўналиши"},
    ]
  },
  {
    id:"order",
    icon:"mandatory",
    color:"#1A6BFF", bg:"#EBF2FF",
    title:{uz:"Buyuruvchi belgilar",ru:"Предписывающие знаки",kril:"Буйрувчи белгилар"},
    desc:{uz:"Haydovchilar bajarishi majburiy bo'lgan harakatlarni ko'rsatuvchi belgilar",ru:"Знаки, указывающие обязательные для выполнения действия",kril:"Ҳайдовчилар бажариши мажбурий бўлган ҳаракатларни кўрсатувчи белгилар"},
    count:21,
    items:[
      {uz:"4.1 — To'g'ri harakat",ru:"4.1 — Движение прямо",kril:"4.1 — Тўғри ҳаракат"},
      {uz:"4.2 — O'ngga harakat",ru:"4.2 — Движение направо",kril:"4.2 — Ўнгга ҳаракат"},
      {uz:"4.3 — Chapga harakat",ru:"4.3 — Движение налево",kril:"4.3 — Чапга ҳаракат"},
      {uz:"4.5 — To'g'ri yoki o'ngga harakat",ru:"4.5 — Движение прямо или направо",kril:"4.5 — Тўғри ёки ўнгга ҳаракат"},
      {uz:"4.7 — O'ngdan aylanib o'tish",ru:"4.7 — Объезд препятствия справа",kril:"4.7 — Ўнгдан айланиб ўтиш"},
      {uz:"4.9 — Aylana bo'ylab harakat",ru:"4.9 — Движение по кольцу",kril:"4.9 — Айлана бўйлаб ҳаракат"},
    ]
  },
  {
    id:"priority",
    icon:"⭐",
    color:"#F59E0B", bg:"#FEF3C7",
    title:{uz:"Imtiyoz belgilari",ru:"Знаки приоритета",kril:"Имтиёз белгилари"},
    desc:{uz:"Kesishmalardagi va tor yo'llardagi harakatlanish tartibini belgilovchi belgilar",ru:"Знаки, устанавливающие порядок проезда перекрёстков и узких участков",kril:"Кесишмалардаги ва тор йўллардаги ҳаракатланиш тартибини белгиловчи белгилар"},
    count:8,
    items:[
      {uz:"2.1 — Asosiy yo'l",ru:"2.1 — Главная дорога",kril:"2.1 — Асосий йўл"},
      {uz:"2.2 — Asosiy yo'l tugashi",ru:"2.2 — Конец главной дороги",kril:"2.2 — Асосий йўл тугаши"},
      {uz:"2.3 — Ikkilamchi yo'lga chiqish",ru:"2.3 — Пересечение со второстепенной дорогой",kril:"2.3 — Иккиламчи йўлга чиқиш"},
      {uz:"2.4 — Yo'l bering",ru:"2.4 — Уступите дорогу",kril:"2.4 — Йўл беринг"},
      {uz:"2.5 — To'xtamay o'tish taqiqlanadi",ru:"2.5 — Движение без остановки запрещено",kril:"2.5 — Тўхтамай ўтиш тақиқланади"},
      {uz:"2.7 — Imtiyozli yo'l harakati",ru:"2.7 — Преимущество перед встречным движением",kril:"2.7 — Имтиёзли йўл ҳаракати"},
    ]
  },
  {
    id:"prohibit",
    icon:"prohibit",
    color:"#EF4444", bg:"#FEE2E2",
    title:{uz:"Taqiqlovchi belgilar",ru:"Запрещающие знаки",kril:"Тақиқловчи белгилар"},
    desc:{uz:"Muayyan harakatlarni taqiqlovchi yoki cheklovchi belgilar",ru:"Знаки, вводящие или отменяющие ограничения движения",kril:"Муайян ҳаракатларни тақиқловчи ёки чекловчи белгилар"},
    count:42,
    items:[
      {uz:"3.1 — Kirish taqiqlanadi",ru:"3.1 — Въезд запрещён",kril:"3.1 — Кириш тақиқланади"},
      {uz:"3.2 — Harakatlanish taqiqlanadi",ru:"3.2 — Движение запрещено",kril:"3.2 — Ҳаракатланиш тақиқланади"},
      {uz:"3.17 — To'xtash taqiqlanadi",ru:"3.17 — Остановка запрещена",kril:"3.17 — Тўхташ тақиқланади"},
      {uz:"3.18 — Turish taqiqlanadi",ru:"3.18 — Стоянка запрещена",kril:"3.18 — Туриш тақиқланади"},
      {uz:"3.20 — O'tib ketish taqiqlanadi",ru:"3.20 — Обгон запрещён",kril:"3.20 — Ўтиб кетиш тақиқланади"},
      {uz:"3.24 — Maksimal tezlik chegarasi",ru:"3.24 — Ограничение максимальной скорости",kril:"3.24 — Максимал тезлик чегараси"},
    ]
  },
  {
    id:"warning",
    icon:"warning",
    color:"#F97316", bg:"#FFEDD5",
    title:{uz:"Ogohlantiruvchi belgilar",ru:"Предупреждающие знаки",kril:"Огоҳлантирувчи белгилар"},
    desc:{uz:"Xavfli yo'l uchastkasi va sharoitlari haqida oldindan ogohlantiruvchi belgilar",ru:"Знаки, предупреждающие об опасных участках дороги",kril:"Хавфли йўл участкаси ва шароитлари ҳақида олдиндан огоҳлантирувчи белгилар"},
    count:29,
    items:[
      {uz:"1.1 — Xavfli burilish (o'ngga)",ru:"1.1 — Опасный поворот (направо)",kril:"1.1 — Хавфли бурилиш (ўнгга)"},
      {uz:"1.3 — Ko'p burilishlar",ru:"1.3 — Опасные повороты",kril:"1.3 — Кўп бурилишлар"},
      {uz:"1.5 — Tekis bo'lmagan yo'l",ru:"1.5 — Неровная дорога",kril:"1.5 — Текис бўлмаган йўл"},
      {uz:"1.11 — Temir yo'l kesishmasi (shlagbaum bilan)",ru:"1.11 — Ж/д переезд со шлагбаумом",kril:"1.11 — Темир йўл кесишмаси (шлагбаум билан)"},
      {uz:"1.21 — Piyodalar o'tish joyi",ru:"1.21 — Пешеходный переход",kril:"1.21 — Пиёдалар ўтиш жойи"},
      {uz:"1.23 — Bolalar",ru:"1.23 — Дети",kril:"1.23 — Болалар"},
    ]
  },
  {
    id:"additional",
    icon:"info",
    color:"#8B5CF6", bg:"#F5F3FF",
    title:{uz:"Qo'shimcha axborot belgilari",ru:"Знаки дополнительной информации",kril:"Қўшимча ахборот белгилари"},
    desc:{uz:"Boshqa belgilar ta'sirini aniqlashtiruvchi yoki cheklovchi jadvallar",ru:"Таблички, уточняющие или ограничивающие действие других знаков",kril:"Бошқа белгилар таъсирини аниқлаштирувчи ёки чекловчи жадваллар"},
    count:18,
    items:[
      {uz:"7.1 — Ta'sir masofasi",ru:"7.1 — Расстояние до объекта",kril:"7.1 — Таъсир масофаси"},
      {uz:"7.2 — Zona uzunligi",ru:"7.2 — Протяжённость зоны",kril:"7.2 — Зона узунлиги"},
      {uz:"7.3 — Yo'nalish va masofa",ru:"7.3 — Направление и расстояние",kril:"7.3 — Йўналиш ва масофа"},
      {uz:"7.4 — Transport vositasi turi",ru:"7.4 — Вид транспортного средства",kril:"7.4 — Транспорт воситаси тури"},
      {uz:"7.5 — Harakat vaqti",ru:"7.5 — Время действия",kril:"7.5 — Ҳаракат вақти"},
      {uz:"7.6 — Dam olish kunlari",ru:"7.6 — Дни недели",kril:"7.6 — Дам олиш кунлари"},
    ]
  },
  {
    id:"temporary",
    icon:"warning2",
    color:"#F59E0B", bg:"#FEF3C7",
    title:{uz:"Vaqtinchalik belgilar",ru:"Временные знаки",kril:"Вақтинчалик белгилар"},
    desc:{uz:"Sariq fonda joylashtirilgan, muvaqqat harakatlanish tartibini belgilovchi belgilar",ru:"Знаки на жёлтом фоне, временно изменяющие порядок движения",kril:"Сариқ фонда жойлаштирилган, муваққат ҳаракатланиш тартибини белгиловчи белгилар"},
    count:12,
    items:[
      {uz:"Sariq fon — vaqtinchalik belgi ekanligini bildiradi",ru:"Жёлтый фон указывает на временный характер знака",kril:"Сариқ фон — вақтинчалик белги эканлигини билдиради"},
      {uz:"Yo'l ta'miri ishlari paytida qo'llaniladi",ru:"Применяются при дорожных работах",kril:"Йўл таъмири ишлари пайтида қўлланилади"},
      {uz:"Doimiy belgilar bilan zid bo'lsa, vaqtinchalik belgiga rioya qilish kerak",ru:"При противоречии с постоянными — выполнять временный знак",kril:"Доимий белгилар билан зид бўлса, вақтинчалик белгига риоя қилиш керак"},
      {uz:"Portativ svetofor doimiy svetofor bilan zid bo'lsa — portativga bo'ysiniladi",ru:"Переносной светофор имеет приоритет над стационарным",kril:"Портатив светофор доимий светофор билан зид бўлса — портативга бўйсинилади"},
    ]
  },
  {
    id:"service",
    icon:"hospital",
    color:"#22C55E", bg:"#DCFCE7",
    title:{uz:"Xizmat ko'rsatish belgilari",ru:"Знаки сервиса",kril:"Хизмат кўрсатиш белгилари"},
    desc:{uz:"Xizmat ko'rsatish ob'ektlari joylashgan joyni ko'rsatuvchi belgilar",ru:"Знаки, указывающие расположение объектов сервиса",kril:"Хизмат кўрсатиш объектлари жойлашган жойни кўрсатувчи белгилар"},
    count:16,
    items:[
      {uz:"6.1 — Tibbiy yordam punkti",ru:"6.1 — Пункт медицинской помощи",kril:"6.1 — Тиббий ёрдам пункти"},
      {uz:"6.3 — Telefon",ru:"6.3 — Телефон",kril:"6.3 — Телефон"},
      {uz:"6.5 — Yoqilg'i quyish shohobchasi",ru:"6.5 — Автозаправочная станция",kril:"6.5 — Ёқилғи қуйиш шоҳобчаси"},
      {uz:"6.7 — Texnik xizmat ko'rsatish",ru:"6.7 — Техническое обслуживание",kril:"6.7 — Техник хизмат кўрсатиш"},
      {uz:"6.9 — Avtomoychma",ru:"6.9 — Мойка автомобилей",kril:"6.9 — Автомойча"},
      {uz:"6.11 — Oshxona",ru:"6.11 — Пункт питания",kril:"6.11 — Ошхона"},
    ]
  },
];

// ─── BACKEND <-> FRONTEND MA'LUMOT FORMATI O'GIRISH ───

// Backend savolini frontend formatiga o'giradi (topicId -> topicIndex)
function apiQuestionToLocal(q, topicsList) {
  const topicIndex = q.topicId ? topicsList.findIndex(t => t.id === q.topicId) : -1;
  return {
    question: q.question,
    options: q.options,
    correct: q.correct,
    image: q.image || null,
    topicIndex: topicIndex >= 0 ? topicIndex : null,
    explanation: q.explanation,
  };
}

// Frontend savolini backendga yuborish formatiga o'giradi (topicIndex -> topicId)
function localQuestionToApi(q, topicsList) {
  const topic = (q.topicIndex !== null && q.topicIndex !== undefined) ? topicsList[q.topicIndex] : null;
  return {
    question: q.question,
    options: q.options,
    correct: q.correct,
    image: q.image || null,
    topicId: topic?.id || null,
    explanation: q.explanation,
  };
}

// /content/bundle yoki /admin/bundle javobidan tickets/topics/rules/settings'ni
// modul darajasidagi massivlarga (tickets, TOPICS_DATA, SIGNS_CATEGORIES) yuklaydi.
function applyBundleToLocalStores(bundle) {
  if (Array.isArray(bundle.topics)) {
    TOPICS_DATA.length = 0;
    bundle.topics.forEach(t => TOPICS_DATA.push({
      id: t.id,
      icon: t.icon || "book",
      title: t.title,
      count: t.questionCount || 0,
      color: t.color,
      bg: t.color + "18",
    }));
  }

  if (Array.isArray(bundle.tickets)) {
    tickets.length = 0;
    bundle.tickets.forEach(t => tickets.push({
      id: t.number,
      dbId: t.id,
      isPro: t.isPro,
      questions: t.questions.map(q => apiQuestionToLocal(q, TOPICS_DATA)),
    }));
  }

  if (Array.isArray(bundle.rules)) {
    SIGNS_CATEGORIES.length = 0;
    bundle.rules.forEach(cat => SIGNS_CATEGORIES.push({
      id: cat.id,
      icon: cat.icon || "info",
      color: cat.color,
      bg: cat.color + "18",
      title: cat.title,
      desc: cat.desc || { uz: "", ru: "", kril: "" },
      count: cat.items.length,
      items: cat.items.map(it => ({
        id: it.id,
        uz: it.title.uz, ru: it.title.ru, kril: it.title.kril,
        desc: it.desc || undefined,
        image: it.image || undefined,
      })),
    }));
  }

  if (bundle.settings) {
    if (bundle.settings.limits) Object.assign(LIMITS, bundle.settings.limits);
    if (bundle.settings.discount) Object.assign(DISCOUNT, bundle.settings.discount);
    if (bundle.settings.prices) Object.assign(PRICES, bundle.settings.prices);
    if (Array.isArray(bundle.settings.referral_milestones)) {
      REFERRAL_CONFIG.milestones = bundle.settings.referral_milestones;
    }
  }
}

// Admin bundle javobidan ADMINS/PENDING_CHANGES/PRO_REQUESTS/REFERRAL_GRANTS/SENT_NOTIFICATIONS'ni yuklaydi
function applyAdminBundleToLocalStores(bundle) {
  applyBundleToLocalStores(bundle); // tickets/topics/rules/settings ham bor bo'lsa, yuklaydi

  if (Array.isArray(bundle.admins)) { ADMINS = bundle.admins; }
  if (Array.isArray(bundle.pendingChanges)) { PENDING_CHANGES = bundle.pendingChanges; }
  if (Array.isArray(bundle.proRequests)) { PRO_REQUESTS = bundle.proRequests; }
  if (Array.isArray(bundle.referralGrants)) { REFERRAL_GRANTS = bundle.referralGrants; }
  if (Array.isArray(bundle.sentNotifications)) { SENT_NOTIFICATIONS = bundle.sentNotifications; }
}

// /content/bundle dan yuklash (har bir foydalanuvchi uchun, login muvaffaqiyatli bo'lganda)
async function loadContentBundle(token) {
  try {
    const bundle = await apiGet('/content/bundle', token);
    applyBundleToLocalStores(bundle);
    return true;
  } catch (err) {
    console.warn('Content bundle yuklanmadi, offline ma\'lumotlar ishlatiladi:', err);
    return false;
  }
}

// /admin/bundle dan yuklash (faqat admin foydalanuvchilar uchun, Admin panel ochilganda)
async function loadAdminBundle(token) {
  try {
    const bundle = await apiGet('/admin/bundle', token);
    applyAdminBundleToLocalStores(bundle);
    return bundle;
  } catch (err) {
    console.warn('Admin bundle yuklanmadi, offline ma\'lumotlar ishlatiladi:', err);
    return null;
  }
}

// Sahifa yuklanganda saqlangan admin ma'lumotlarini tiklash (backend mavjud bo'lmaganda offline rejim)
loadPersistedAdminData();

function RulesScreen({setScreen,T,C,lang,savedQuestions,setSavedQuestions}) {
  const [selected,setSelected]=useState(null);
  const [expanded,setExpanded]=useState(null);

  const toggleBookmark=(key,item)=>{
    if(savedQuestions.some(s=>s.key===key)){
      setSavedQuestions(savedQuestions.filter(s=>s.key!==key));
    } else {
      setSavedQuestions([...savedQuestions,{key,question:{uz:item.uz,ru:item.ru||item.uz,kril:item.kril||item.uz},options:{uz:[],ru:[],kril:[]},correct:0,ticketId:"rules"}]);
    }
  };

  if(selected!==null){
    const cat=SIGNS_CATEGORIES[selected];
    return (
      <div style={{minHeight:"100vh",background:C.bg}}>
        {/* Header */}
        <div style={{background:`linear-gradient(135deg,${cat.color},${cat.color}bb)`,padding:"52px 20px 24px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
            <button onClick={()=>{setSelected(null);setExpanded(null);}}
              style={{width:36,height:36,borderRadius:12,background:"rgba(255,255,255,0.2)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <IC.ArrowLeft size={18} color="white"/>
            </button>
            <div style={{width:40,height:40,borderRadius:12,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><TopicIcon icon={cat.icon} size={20} color="white"/></div>
            <h2 style={{color:"white",fontSize:18,fontWeight:800,margin:0,flex:1}}>
              {cat.title[lang]||cat.title.uz}
            </h2>
          </div>
          <p style={{color:"rgba(255,255,255,0.8)",fontSize:13,margin:0,lineHeight:1.5}}>
            {cat.desc[lang]||cat.desc.uz}
          </p>
          <div style={{marginTop:12,display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.2)",borderRadius:20,padding:"5px 12px"}}>
            <span style={{color:"white",fontSize:12,fontWeight:700}}>{cat.count} ta belgi</span>
          </div>
        </div>
        {/* Items accordion */}
        <div style={{padding:16,display:"flex",flexDirection:"column",gap:10}}>
          {cat.items.map((item,j)=>{
            const bKey=`rules-${selected}-${j}`;
            const isSaved=savedQuestions.some(s=>s.key===bKey);
            return (
            <div key={j} style={{background:C.card,borderRadius:16,overflow:"hidden",border:`1px solid ${C.cardBorder}`,boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
              <div onClick={()=>setExpanded(expanded===j?null:j)}
                style={{padding:"14px 16px",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
                <div style={{width:34,height:34,borderRadius:10,background:cat.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontSize:13,fontWeight:800,color:cat.color}}>{j+1}</span>
                </div>
                <span style={{flex:1,fontSize:13,fontWeight:600,color:C.text,lineHeight:1.4}}>
                  {item[lang]||item.uz}
                </span>
                <button onClick={e=>{e.stopPropagation();toggleBookmark(bKey,item);}} style={{width:30,height:30,borderRadius:8,border:"none",background:isSaved?"#FEF3C7":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <IC.Bookmark size={16} color={isSaved?"#F59E0B":C.gray400}/>
                </button>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{transform:expanded===j?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.2s",flexShrink:0}}>
                  <polyline points="6 9 12 15 18 9" stroke={C.gray400} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              {expanded===j&&(
                <div style={{borderTop:`1px solid ${C.gray200}`,padding:"12px 16px",background:cat.bg+"44"}}>
                  {item.image&&<img src={item.image} alt="" style={{width:"100%",maxHeight:160,objectFit:"contain",borderRadius:10,marginBottom:10,background:"white"}}/>}
                  <p style={{margin:0,fontSize:12,color:C.subtext,lineHeight:1.6}}>
                    {item.desc ? (item.desc[lang]||item.desc.uz) : `${item[lang]||item.uz} — ushbu belgi yo'l harakati ishtirokchilarini tegishli sharoit yoki cheklov haqida xabardor qiladi.`}
                  </p>
                </div>
              )}
            </div>
          );})}
        </div>
      </div>
    );
  }

  // Main categories list
  return (
    <div style={{minHeight:"100vh",background:C.bg}}>
      <div style={{background:`linear-gradient(135deg,#EC4899,#8B5CF6)`,padding:"52px 20px 24px"}}>
        <h2 style={{color:"white",fontSize:22,fontWeight:800,margin:0}}>{T.rulesTitle}</h2>
        <p style={{color:"rgba(255,255,255,0.7)",fontSize:13,margin:"4px 0 0"}}>{T.rulesSub}</p>
        <div style={{marginTop:12,display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.15)",borderRadius:20,padding:"5px 14px"}}>
          <span style={{color:"white",fontSize:12,fontWeight:700}}>{SIGNS_CATEGORIES.length} {T.rulesSections||"bo'lim"} • {SIGNS_CATEGORIES.reduce((s,c)=>s+(c.items?.length||0),0)} {T.rulesSigns||"ta belgi"}</span>
        </div>
      </div>
      <div style={{padding:16,display:"flex",flexDirection:"column",gap:10}}>
        {SIGNS_CATEGORIES.map((cat,i)=>(
          <div key={i} onClick={()=>setSelected(i)}
            style={{background:C.card,borderRadius:18,padding:"16px 18px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",border:`1px solid ${C.cardBorder}`,boxShadow:"0 1px 6px rgba(0,0,0,0.05)",transition:"transform 0.15s"}}>
            <div style={{width:50,height:50,borderRadius:16,background:cat.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <TopicIcon icon={cat.icon} size={24} color={cat.color}/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:3}}>
                {cat.title[lang]||cat.title.uz}
              </div>
              <div style={{fontSize:11,color:C.subtext,lineHeight:1.4,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                {cat.count} ta belgi
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
              <div style={{background:cat.bg,borderRadius:20,padding:"4px 10px"}}>
                <span style={{fontSize:11,fontWeight:700,color:cat.color}}>{cat.count}</span>
              </div>
              <IC.ChevronRight size={16} color={C.gray400}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TELEGRAM MINI APP HOOK ───
// window.Telegram.WebApp orqali Telegram bilan muloqot
function useTelegram() {
  const tg = typeof window !== "undefined" ? window?.Telegram?.WebApp : null;

  useEffect(() => {
    if (!tg) return;
    tg.expand();
    tg.ready();
  }, []);

  // Header va background rangini dark/light ga qarab sozlash
  // (dark state App da boshqariladi, shuning uchun bu hook'dan olib tashlandi)
  // App komponenti ichida setDark orqali boshqariladi

  // Telegram foydalanuvchi ma'lumotlari
  const tgUser = tg?.initDataUnsafe?.user || null;
  // Deep-link orqali ochilgan bo'lsa (masalan Duel taklifi): ?start=duel_<id>
  const startParam = tg?.initDataUnsafe?.start_param || null;

  // Telegram Back button boshqaruvi
  const showBackButton = (onBack) => {
    if (!tg) return;
    tg.BackButton.show();
    tg.BackButton.onClick(onBack);
  };

  const hideBackButton = () => {
    if (!tg) return;
    tg.BackButton.hide();
    tg.BackButton.offClick();
  };

  // Telegram Main button boshqaruvi
  const showMainButton = (text, onClick, color = "#1A6BFF") => {
    if (!tg) return;
    tg.MainButton.setText(text);
    tg.MainButton.color = color;
    tg.MainButton.show();
    tg.MainButton.onClick(onClick);
  };

  const hideMainButton = () => {
    if (!tg) return;
    tg.MainButton.hide();
    tg.MainButton.offClick();
  };

  // Telegram mavzusi (qorong'i yoki yorug')
  const isDark = tg?.colorScheme === "dark";

  // Haptic feedback
  const haptic = {
    light: () => tg?.HapticFeedback?.impactOccurred("light"),
    medium: () => tg?.HapticFeedback?.impactOccurred("medium"),
    success: () => tg?.HapticFeedback?.notificationOccurred("success"),
    error: () => tg?.HapticFeedback?.notificationOccurred("error"),
  };

  // Telegram safe area (ekranning xavfsiz hududi - notch, status bar)
  const safeTop = tg?.safeAreaInset?.top || 0;

  // Backend ga login
  const loginToBackend = async () => {
    const initData = tg?.initData;
    if (!initData) return null;
    try {
      // Agar foydalanuvchi referal havolasi orqali kirgan bo'lsa (?start=NAZxxxx),
      // buni backendga yuboramiz — yangi foydalanuvchi uchun "kim taklif qilgani" saqlanadi.
      // Duel taklif havolalari ("duel_...") referal kodi emas, shuning uchun ajratamiz.
      const referredBy = (startParam && !startParam.startsWith("duel_")) ? startParam : undefined;
      const res = await apiPost('/auth/telegram', { initData, referredBy });
      return res;
    } catch (err) {
      console.error('Backend login xatosi:', err);
      return null;
    }
  };

  return { tg, tgUser, startParam, isDark, showBackButton, hideBackButton, showMainButton, hideMainButton, haptic, safeTop, loginToBackend };
}

// ─── ADMIN PANEL ───
const ADMIN_COLORS = ["#1A6BFF","#22C55E","#F59E0B","#8B5CF6","#EC4899","#EF4444","#0EA5E9","#F97316","#14B8A6","#6366F1"];

function AdminInput({label,value,onChange,C,type="text",placeholder}) {
  return (
    <div style={{marginBottom:12}}>
      {label && <label style={{fontSize:12,color:C.subtext,fontWeight:600,display:"block",marginBottom:6}}>{label}</label>}
      <input type={type} value={value} placeholder={placeholder} onChange={e=>onChange(type==="number"?Number(e.target.value):e.target.value)}
        style={{width:"100%",boxSizing:"border-box",background:C.inputBg,borderRadius:12,padding:"11px 14px",border:`1.5px solid ${C.gray200}`,fontSize:14,color:C.text,outline:"none"}}/>
    </div>
  );
}

function AdminToggle({checked,onChange,C,label}) {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
      <span style={{fontSize:13,fontWeight:600,color:C.text}}>{label}</span>
      <div onClick={()=>onChange(!checked)} style={{width:44,height:26,borderRadius:13,background:checked?C.primary:C.gray300,position:"relative",cursor:"pointer",transition:"background 0.2s"}}>
        <div style={{position:"absolute",top:2,left:checked?20:2,width:22,height:22,borderRadius:"50%",background:"white",transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/>
      </div>
    </div>
  );
}

function AdminModal({title,onClose,onSave,C,T,children}) {
  return (
    <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)"}}/>
      <div style={{position:"relative",width:"100%",maxHeight:"85vh",overflowY:"auto",background:C.card,borderRadius:"24px 24px 0 0",padding:"20px 20px 32px",zIndex:1}}>
        <div style={{width:40,height:4,borderRadius:2,background:C.gray300,margin:"0 auto 16px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <span style={{fontWeight:800,fontSize:16,color:C.text}}>{title}</span>
          <button onClick={onClose} style={{background:C.gray100,border:"none",borderRadius:10,width:32,height:32,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <IC.XCircle size={18} color={C.gray400}/>
          </button>
        </div>
        {children}
        <div style={{display:"flex",gap:10,marginTop:8}}>
          <button onClick={onClose} style={{flex:1,padding:"13px",borderRadius:12,border:`1.5px solid ${C.gray200}`,background:"transparent",color:C.subtext,fontSize:14,fontWeight:700,cursor:"pointer"}}>{T.adminCancel}</button>
          <button onClick={onSave} style={{flex:2,padding:"13px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,color:"white",fontSize:14,fontWeight:800,cursor:"pointer"}}>{T.adminSave}</button>
        </div>
      </div>
    </div>
  );
}

function AdminScreen({setScreen,T,C,user,lang,notifs,setNotifs,addToast,grantPro,token,bumpDataVersion}) {
  const myPerms = user?.adminPerms || ADMIN_PERMS[user?.adminRole] || [];

  if(!user?.isAdmin) {
    return (
      <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
        <div style={{textAlign:"center"}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:12}}><IC.Lock size={48} color={C.gray400}/></div>
          <div style={{fontWeight:700,fontSize:15,color:C.text,marginBottom:16}}>{T.adminNoAccess}</div>
          <button onClick={()=>setScreen("profile")} style={{padding:"12px 24px",borderRadius:12,border:"none",background:C.primary,color:"white",fontWeight:700,cursor:"pointer"}}>{T.back}</button>
        </div>
      </div>
    );
  }

  const allTabs = [
    {id:"dashboard", label:T.adminDashboard, Icon:IC.BarChart, perm:null},
    {id:"changes",   label:T.adminChanges,   Icon:IC.Edit,     perm:null},
    {id:"tickets",   label:T.adminTickets,   Icon:IC.Ticket,   perm:"tickets"},
    {id:"topics",    label:T.adminTopics,    Icon:IC.Map,      perm:"topics"},
    {id:"rules",     label:T.adminRules,     Icon:IC.Shield,   perm:"rules"},
    {id:"notifs",    label:T.adminNotifs,    Icon:IC.Bell,     perm:"notifications"},
    {id:"pro",       label:T.adminPro,       Icon:IC.Diamond,  perm:"pro"},
    {id:"admins",    label:T.adminAdmins,    Icon:IC.Users,    perm:"admins"},
  ].filter(t=>!t.perm || myPerms.includes(t.perm));

  const [tab,setTab]=useState(allTabs[0]?.id||"dashboard");

  const isSuper = user?.adminRole === "super";
  const [pendingChanges,setPendingChanges]=useState(()=>[...PENDING_CHANGES]);
  const [dashboard,setDashboard]=useState(null);

  // Biletlar/Mavzular/Qoidalar ro'yxatlarini asosiy ma'lumotlardan qayta o'qish
  const refreshAllLists = () => {
    setTicketList(tickets.map(t=>({id:t.id,isPro:t.isPro,qCount:t.questions.length})));
    setTopicList([...TOPICS_DATA]);
    setRuleCats([...SIGNS_CATEGORIES]);
  };

  // Super admin bo'lsa — darhol qo'llaydi. Boshqa adminlar bo'lsa — tasdiqlash navbatiga qo'yadi.
  // Token mavjud bo'lsa — backendga so'rov yuboriladi; bo'lmasa — offline (localStorage) rejimda ishlaydi.
  const requestOrApply = async (type, payload, description) => {
    if(token){
      try{
        let res;
        switch(type){
          case "add_ticket":
            res = await apiPost("/admin/tickets", {isPro:payload.ticket.isPro, questionCount:payload.ticket.questions.length}, token);
            break;
          case "delete_ticket": {
            const t = tickets.find(x=>x.id===payload.ticketId);
            res = await apiDelete(`/admin/tickets/${t?.dbId??payload.ticketId}`, token);
            break;
          }
          case "toggle_ticket_pro": {
            const t = tickets.find(x=>x.id===payload.ticketId);
            res = await apiPatch(`/admin/tickets/${t?.dbId??payload.ticketId}`, {isPro:payload.isPro}, token);
            break;
          }
          case "edit_ticket_questions": {
            const t = tickets.find(x=>x.id===payload.ticketId);
            const apiQuestions = payload.questions.map(q=>localQuestionToApi(q, TOPICS_DATA));
            res = await apiPatch(`/admin/tickets/${t?.dbId??payload.ticketId}/questions`, {questions:apiQuestions}, token);
            break;
          }
          case "add_topic":
            res = await apiPost("/admin/topics", {title:payload.topic.title, color:payload.topic.color, icon:payload.topic.icon}, token);
            break;
          case "delete_topic":
            res = await apiDelete(`/admin/topics/${payload.topicId}`, token);
            break;
          case "add_rule_category":
            res = await apiPost("/admin/rules/categories", {title:payload.category.title, color:payload.category.color, icon:payload.category.icon}, token);
            break;
          case "add_rule_item":
            res = await apiPost(`/admin/rules/categories/${payload.catId}/items`, {item:payload.item}, token);
            break;
          case "delete_rule_item": {
            const cat = SIGNS_CATEGORIES.find(c=>c.id===payload.catId);
            const item = cat?.items?.[payload.itemIndex];
            res = await apiDelete(`/admin/rules/items/${item?.id}`, token);
            break;
          }
          default:
            throw new Error("Noma'lum o'zgarish turi: "+type);
        }
        if(res.applied!==false){
          await loadAdminBundle(token);
          refreshAllLists();
          setPendingChanges([...PENDING_CHANGES]);
          bumpDataVersion?.();
          addToast?.(T.adminSuccess,"success");
        } else if(res.pendingChange){
          PENDING_CHANGES = [res.pendingChange, ...PENDING_CHANGES];
          setPendingChanges([...PENDING_CHANGES]);
          addToast?.(T.adminChangeSubmitted,"info");
        }
      } catch(err){
        console.error(err);
        addToast?.(T.adminSuccess,"success");
      }
      return;
    }

    // ── OFFLINE REJIM (localStorage) ──
    if(isSuper){
      applyChange(type, payload);
      refreshAllLists();
      savePersistedAdminData();
      addToast?.(T.adminSuccess,"success");
    } else {
      const change = {
        id: Date.now(), type, payload, description,
        adminName: user?.name || "Admin", adminTgId: user?.tgId || null,
        status: "pending", createdAt: Date.now(),
      };
      PENDING_CHANGES = [change, ...PENDING_CHANGES];
      setPendingChanges([...PENDING_CHANGES]);
      savePersistedAdminData();
      addToast?.(T.adminChangeSubmitted,"info");
    }
  };

  const approveChange = async (change) => {
    if(token){
      try{
        await apiPost(`/admin/changes/${change.id}/approve`, {}, token);
        await loadAdminBundle(token);
        refreshAllLists();
        setPendingChanges([...PENDING_CHANGES]);
        bumpDataVersion?.();
        addToast?.(T.adminSuccess,"success");
      } catch(err){ console.error(err); }
      return;
    }
    applyChange(change.type, change.payload);
    refreshAllLists();
    PENDING_CHANGES = PENDING_CHANGES.map(c=>c.id===change.id?{...c,status:"approved"}:c);
    setPendingChanges([...PENDING_CHANGES]);
    savePersistedAdminData();
    addToast?.(T.adminSuccess,"success");
  };
  const rejectChange = async (change) => {
    if(token){
      try{
        await apiPost(`/admin/changes/${change.id}/reject`, {}, token);
        await loadAdminBundle(token);
        setPendingChanges([...PENDING_CHANGES]);
        addToast?.(T.adminDeleted,"success");
      } catch(err){ console.error(err); }
      return;
    }
    PENDING_CHANGES = PENDING_CHANGES.map(c=>c.id===change.id?{...c,status:"rejected"}:c);
    setPendingChanges([...PENDING_CHANGES]);
    savePersistedAdminData();
    addToast?.(T.adminDeleted,"success");
  };
  // Rad etilgan o'zgarishni qayta "Kutilmoqda" holatiga qaytarish — hech narsa butunlay o'chmaydi
  const restoreChange = async (change) => {
    if(token){
      try{
        await apiPost(`/admin/changes/${change.id}/restore`, {}, token);
        await loadAdminBundle(token);
        setPendingChanges([...PENDING_CHANGES]);
        addToast?.(T.adminSuccess,"success");
      } catch(err){ console.error(err); }
      return;
    }
    PENDING_CHANGES = PENDING_CHANGES.map(c=>c.id===change.id?{...c,status:"pending"}:c);
    setPendingChanges([...PENDING_CHANGES]);
    savePersistedAdminData();
    addToast?.(T.adminSuccess,"success");
  };

  // ── KUTILAYOTGAN O'ZGARISHNI TAHRIRLASH (oddiy maydonlar) ──
  const [editingChangePayload,setEditingChangePayload]=useState(null); // {change, form}

  const openEditChangePayload=(change)=>{
    if(change.type==="add_topic"){
      const t=change.payload.topic;
      setEditingChangePayload({change, form:{uz:t.title.uz, ru:t.title.ru, kril:t.title.kril, count:t.count, color:t.color}});
    } else if(change.type==="add_rule_category"){
      const cat=change.payload.category;
      setEditingChangePayload({change, form:{uz:cat.title.uz, ru:cat.title.ru, kril:cat.title.kril, color:cat.color}});
    } else if(change.type==="add_rule_item"){
      const it=change.payload.item;
      setEditingChangePayload({change, form:{uz:it.uz, ru:it.ru, kril:it.kril, descUz:it.desc?.uz||"", descRu:it.desc?.ru||"", descKril:it.desc?.kril||"", image:it.image||null}});
    }
  };
  const saveEditChangePayload=async ()=>{
    const {change, form} = editingChangePayload;
    let newPayload = {...change.payload};
    let newDescription = change.description;
    if(change.type==="add_topic"){
      newPayload.topic = {...change.payload.topic, title:{uz:form.uz,ru:form.ru||form.uz,kril:form.kril||form.uz}, count:form.count, color:form.color, bg:form.color+"18"};
      newDescription = `${T.changeAddTopic}: ${form.uz}`;
    } else if(change.type==="add_rule_category"){
      newPayload.category = {...change.payload.category, title:{uz:form.uz,ru:form.ru||form.uz,kril:form.kril||form.uz}, color:form.color, bg:form.color+"18"};
      newDescription = `${T.changeAddRuleCategory}: ${form.uz}`;
    } else if(change.type==="add_rule_item"){
      const item={uz:form.uz, ru:form.ru||form.uz, kril:form.kril||form.uz};
      if(form.descUz.trim()) item.desc={uz:form.descUz, ru:form.descRu||form.descUz, kril:form.descKril||form.descUz};
      if(form.image) item.image=form.image;
      newPayload.item = item;
      newDescription = `${T.changeAddRuleItem}: ${form.uz}`;
    }
    if(token){
      try{
        await apiPatch(`/admin/changes/${change.id}`, {payload:newPayload, description:newDescription}, token);
        await loadAdminBundle(token);
        setPendingChanges([...PENDING_CHANGES]);
        addToast?.(T.adminSuccess,"success");
      } catch(err){ console.error(err); }
      setEditingChangePayload(null);
      return;
    }
    PENDING_CHANGES = PENDING_CHANGES.map(c=>c.id===change.id?{...c, payload:newPayload, description:newDescription}:c);
    setPendingChanges([...PENDING_CHANGES]);
    savePersistedAdminData();
    addToast?.(T.adminSuccess,"success");
    setEditingChangePayload(null);
  };
  // Bilet holatini (Pro/Bepul) tasdiqlashdan oldin o'zgartirish
  const togglePendingProValue=async (change)=>{
    const newIsPro=!change.payload.isPro;
    const newDescription = `${T.changeToggleTicketPro} #${change.payload.ticketId} → ${newIsPro?"PRO":T.adminFreeTicket.split(" ")[0]}`;
    const newPayload = {...change.payload, isPro:newIsPro};
    if(token){
      try{
        await apiPatch(`/admin/changes/${change.id}`, {payload:newPayload, description:newDescription}, token);
        await loadAdminBundle(token);
        setPendingChanges([...PENDING_CHANGES]);
      } catch(err){ console.error(err); }
      return;
    }
    PENDING_CHANGES = PENDING_CHANGES.map(c=>c.id===change.id?{...c, payload:newPayload, description:newDescription}:c);
    setPendingChanges([...PENDING_CHANGES]);
    savePersistedAdminData();
  };

  // ── TICKETS STATE ──
  const [ticketList,setTicketList]=useState(()=>tickets.map(t=>({id:t.id,isPro:t.isPro,qCount:t.questions.length})));
  const [showAddTicket,setShowAddTicket]=useState(false);
  const [newTicketQCount,setNewTicketQCount]=useState(20);
  const [newTicketPro,setNewTicketPro]=useState(false);

  const toggleTicketPro=(id)=>{
    const t = tickets.find(x=>x.id===id);
    const newIsPro = !(t?.isPro);
    requestOrApply("toggle_ticket_pro", {ticketId:id, isPro:newIsPro}, `${T.changeToggleTicketPro} #${id} → ${newIsPro?"PRO":T.adminFreeTicket.split(" ")[0]}`);
  };
  const deleteTicket=(id)=>{
    requestOrApply("delete_ticket", {ticketId:id}, `${T.changeDeleteTicket} #${id}`);
  };
  const addTicket=()=>{
    const newId = tickets.length ? Math.max(...tickets.map(t=>t.id))+1 : 1;
    const newTicket = {
      id:newId,
      isPro:newTicketPro,
      questions:Array.from({length:newTicketQCount},(_,j)=>({
        id:j+1,
        question:{uz:"",ru:"",kril:""},
        options:{uz:["","","",""],ru:["","","",""],kril:["","","",""]},
        correct:0, sign:null,
        explanation:{uz:"",ru:"",kril:""}
      }))
    };
    requestOrApply("add_ticket", {ticket:newTicket}, `${T.changeAddTicket} #${newId}`);
    setShowAddTicket(false);
    setNewTicketQCount(20);
    setNewTicketPro(false);
  };

  // ── TOPICS STATE ──
  const [topicList,setTopicList]=useState(()=>[...TOPICS_DATA]);
  const [showAddTopic,setShowAddTopic]=useState(false);
  const [newTopic,setNewTopic]=useState({uz:"",ru:"",kril:"",count:10,color:ADMIN_COLORS[0]});

  const addTopic=()=>{
    if(!newTopic.uz.trim()) return;
    const item = { id:"topic"+Date.now(), icon:"book", title:{uz:newTopic.uz,ru:newTopic.ru||newTopic.uz,kril:newTopic.kril||newTopic.uz}, count:newTopic.count, color:newTopic.color, bg:newTopic.color+"18" };
    requestOrApply("add_topic", {topic:item}, `${T.changeAddTopic}: ${item.title.uz}`);
    setShowAddTopic(false);
    setNewTopic({uz:"",ru:"",kril:"",count:10,color:ADMIN_COLORS[0]});
  };
  const deleteTopic=(i)=>{
    const topic = TOPICS_DATA[i];
    requestOrApply("delete_topic", {topicId:topic.id}, `${T.changeDeleteTopic}: ${topic.title.uz}`);
  };

  // ── RULES STATE ──
  const [ruleCats,setRuleCats]=useState(()=>[...SIGNS_CATEGORIES]);
  const [expandedCat,setExpandedCat]=useState(null);
  const [showAddCat,setShowAddCat]=useState(false);
  const [newCat,setNewCat]=useState({uz:"",ru:"",kril:"",color:ADMIN_COLORS[0]});
  const [newItemText,setNewItemText]=useState({uz:"",ru:"",kril:"",descUz:"",descRu:"",descKril:"",image:null});

  const addCategory=()=>{
    if(!newCat.uz.trim()) return;
    const cat = { id:"cat"+Date.now(), icon:"info", color:newCat.color, bg:newCat.color+"18",
      title:{uz:newCat.uz,ru:newCat.ru||newCat.uz,kril:newCat.kril||newCat.uz},
      desc:{uz:"",ru:"",kril:""}, count:0, items:[] };
    requestOrApply("add_rule_category", {category:cat}, `${T.changeAddRuleCategory}: ${cat.title.uz}`);
    setShowAddCat(false);
    setNewCat({uz:"",ru:"",kril:"",color:ADMIN_COLORS[0]});
  };
  const addRuleItem=(catIdx)=>{
    if(!newItemText.uz.trim()) return;
    const item={uz:newItemText.uz,ru:newItemText.ru||newItemText.uz,kril:newItemText.kril||newItemText.uz};
    if(newItemText.descUz.trim()) item.desc={uz:newItemText.descUz,ru:newItemText.descRu||newItemText.descUz,kril:newItemText.descKril||newItemText.descUz};
    if(newItemText.image) item.image=newItemText.image;
    const catId = SIGNS_CATEGORIES[catIdx].id;
    requestOrApply("add_rule_item", {catId, item}, `${T.changeAddRuleItem}: ${item.uz}`);
    setNewItemText({uz:"",ru:"",kril:"",descUz:"",descRu:"",descKril:"",image:null});
  };
  const deleteRuleItem=(catIdx,itemIdx)=>{
    const cat = SIGNS_CATEGORIES[catIdx];
    const item = cat.items[itemIdx];
    requestOrApply("delete_rule_item", {catId:cat.id, itemIndex:itemIdx}, `${T.changeDeleteRuleItem}: ${item.uz}`);
  };

  // ── SAVOLLAR MUHARRIRI STATE ──
  const [editingQ,setEditingQ]=useState(null); // {refId, refLabel, qIdx, list, elang}

  const normalizeQuestion=(q)=>{
    if(q.question && typeof q.question === "object"){
      const c = JSON.parse(JSON.stringify(q));
      if(c.image===undefined) c.image=null;
      if(c.topicIndex===undefined) c.topicIndex=null;
      return c;
    }
    return {
      id:q.id,
      question:{uz:getQ(q.question,"uz"),ru:getQ(q.question,"ru"),kril:getQ(q.question,"kril")},
      options:{uz:getOpts(q.options,"uz"),ru:getOpts(q.options,"ru"),kril:getOpts(q.options,"kril")},
      correct:q.correct||0,
      sign:q.sign||null,
      image:null,
      topicIndex:null,
      explanation:q.explanation||{uz:"",ru:"",kril:""}
    };
  };

  const openTicketEditor=(ticketId)=>{
    const t = tickets.find(x=>x.id===ticketId);
    if(!t) return;
    setEditingQ({refId:ticketId, refLabel:`${T.ticket} ${ticketId}`, qIdx:0, list:t.questions.map(normalizeQuestion), elang:"uz"});
  };
  // Kutilayotgan o'zgarishdagi savollarni tahrirlash (asosiy ma'lumotlarga tegmaydi)
  const openPendingQuestionEditor=(change)=>{
    const questions = change.type==="add_ticket" ? change.payload.ticket.questions : change.payload.questions;
    const refLabel = change.type==="add_ticket"
      ? `${T.ticket} #${change.payload.ticket.id} (${T.adminStatusPending})`
      : `${T.ticket} #${change.payload.ticketId} (${T.adminStatusPending})`;
    setEditingQ({refId:change.id, refLabel, qIdx:0, list:questions.map(normalizeQuestion), elang:"uz", pendingChangeId:change.id, pendingType:change.type});
  };
  const saveQuestionEditor=async ()=>{
    if(!editingQ) return;
    const questions = editingQ.list.map((q,i)=>({...q, id:i+1}));
    if(editingQ.pendingChangeId){
      const change = PENDING_CHANGES.find(c=>c.id===editingQ.pendingChangeId);
      const newPayload = editingQ.pendingType==="add_ticket"
        ? {...change.payload, ticket:{...change.payload.ticket, questions}}
        : {...change.payload, questions};
      if(token){
        try{
          await apiPatch(`/admin/changes/${editingQ.pendingChangeId}`, {payload:newPayload}, token);
          await loadAdminBundle(token);
          setPendingChanges([...PENDING_CHANGES]);
          addToast?.(T.adminSuccess,"success");
        } catch(err){ console.error(err); }
      } else {
        // Kutilayotgan o'zgarish payload'ini yangilash (hali qo'llanilmaydi)
        PENDING_CHANGES = PENDING_CHANGES.map(c=>c.id===editingQ.pendingChangeId?{...c, payload:newPayload}:c);
        setPendingChanges([...PENDING_CHANGES]);
        savePersistedAdminData();
        addToast?.(T.adminSuccess,"success");
      }
    } else {
      requestOrApply("edit_ticket_questions", {ticketId:editingQ.refId, questions}, `${T.changeEditQuestions} #${editingQ.refId}`);
    }
    setEditingQ(null);
  };
  const updateCurrentQ=(field,value)=>{
    const list=[...editingQ.list];
    const q={...list[editingQ.qIdx]};
    if(field==="correct"||field==="image"||field==="topicIndex"){ q[field]=value; }
    else if(field.startsWith("question.")){ q.question={...q.question,[editingQ.elang]:value}; }
    else if(field.startsWith("explanation.")){ q.explanation={...q.explanation,[editingQ.elang]:value}; }
    else if(field.startsWith("option.")){
      const idx=Number(field.split(".")[1]);
      const opts=[...q.options[editingQ.elang]];
      opts[idx]=value;
      q.options={...q.options,[editingQ.elang]:opts};
    }
    list[editingQ.qIdx]=q;
    setEditingQ({...editingQ,list});
  };
  const addQuestion=()=>{
    const newQ={question:{uz:"",ru:"",kril:""},options:{uz:["","","",""],ru:["","","",""],kril:["","","",""]},correct:0,sign:null,image:null,topicIndex:null,explanation:{uz:"",ru:"",kril:""}};
    const list=[...editingQ.list,newQ];
    setEditingQ({...editingQ,list,qIdx:list.length-1});
  };
  // Rasmni backendga yuklaydi (token bo'lsa) va to'liq URL qaytaradi,
  // aks holda base64 data-URL sifatida o'qiydi (offline rejim)
  const uploadAdminImage = async (file) => {
    if(!file) return null;
    if(token){
      try{
        const formData = new FormData();
        formData.append('file', file);
        const res = await apiUpload('/admin/upload', formData, token);
        return API_URL + res.url;
      } catch(err){ console.error(err); }
    }
    return new Promise(resolve=>{
      const reader=new FileReader();
      reader.onload=()=>resolve(reader.result);
      reader.readAsDataURL(file);
    });
  };
  const handleImageUpload=async (file)=>{
    if(!file) return;
    const url = await uploadAdminImage(file);
    if(url) updateCurrentQ("image",url);
  };
  const removeQuestion=()=>{
    if(editingQ.list.length<=1) return;
    const list=editingQ.list.filter((_,i)=>i!==editingQ.qIdx);
    setEditingQ({...editingQ,list,qIdx:Math.min(editingQ.qIdx,list.length-1)});
  };


  const [sentNotifs,setSentNotifs]=useState(()=>[...SENT_NOTIFICATIONS]);
  const [notifForm,setNotifForm]=useState({titleUz:"",titleRu:"",titleKril:"",bodyUz:"",bodyRu:"",bodyKril:"",type:"new"});
  const notifTypes=[
    {id:"exam",   label:T.notifExam},
    {id:"result", label:T.notifResult},
    {id:"new",    label:T.notifNew},
    {id:"daily",  label:T.notifDaily},
  ];
  const sendNotification=async ()=>{
    if(!notifForm.titleUz.trim()||!notifForm.bodyUz.trim()) return;
    const title={uz:notifForm.titleUz, ru:notifForm.titleRu||notifForm.titleUz, kril:notifForm.titleKril||notifForm.titleUz};
    const body={uz:notifForm.bodyUz, ru:notifForm.bodyRu||notifForm.bodyUz, kril:notifForm.bodyKril||notifForm.bodyUz};
    if(token){
      try{
        await apiPost("/admin/notifications", {type:notifForm.type, title, body}, token);
        await loadAdminBundle(token);
        setSentNotifs([...SENT_NOTIFICATIONS]);
        addToast?.(T.adminSuccess,"success");
      } catch(err){ console.error(err); }
      setNotifForm({titleUz:"",titleRu:"",titleKril:"",bodyUz:"",bodyRu:"",bodyKril:"",type:"new"});
      return;
    }
    const notif = { id:Date.now(), type:notifForm.type, read:false, time:0, title, body };
    SENT_NOTIFICATIONS = [notif, ...SENT_NOTIFICATIONS];
    setSentNotifs([...SENT_NOTIFICATIONS]);
    if(setNotifs) setNotifs([notif, ...notifs]);
    setNotifForm({titleUz:"",titleRu:"",titleKril:"",bodyUz:"",bodyRu:"",bodyKril:"",type:"new"});
    savePersistedAdminData();
    addToast?.(T.adminSuccess,"success");
  };

  // ── PRO / DISCOUNT / LIMITS STATE ──
  const [discount,setDiscountForm]=useState(()=>({...DISCOUNT}));
  const [limits,setLimitsForm]=useState(()=>({...LIMITS}));
  const [prices,setPricesForm]=useState(()=>({...PRICES}));
  const [milestones,setMilestonesForm]=useState(()=>REFERRAL_CONFIG.milestones.map(m=>({...m})));

  const saveProSettings=async ()=>{
    if(token){
      try{
        await Promise.all([
          apiPatch("/settings/discount", discount, token),
          apiPatch("/settings/limits", limits, token),
          apiPatch("/settings/prices", prices, token),
          apiPatch("/settings/referral_milestones", milestones, token),
        ]);
        Object.assign(DISCOUNT, discount);
        Object.assign(LIMITS, limits);
        Object.assign(PRICES, prices);
        REFERRAL_CONFIG.milestones = milestones.map(m=>({...m}));
        bumpDataVersion?.();
        addToast?.(T.adminSuccess,"success");
      } catch(err){ console.error(err); }
      return;
    }
    Object.assign(DISCOUNT, discount);
    Object.assign(LIMITS, limits);
    Object.assign(PRICES, prices);
    REFERRAL_CONFIG.milestones = milestones.map(m=>({...m}));
    savePersistedAdminData();
    addToast?.(T.adminSuccess,"success");
  };
  const updateMilestone=(i,field,val)=>{
    const copy=[...milestones];
    copy[i] = {...copy[i], [field]: val};
    setMilestonesForm(copy);
  };
  const removeMilestone=(i)=>setMilestonesForm(milestones.filter((_,idx)=>idx!==i));
  const addMilestone=()=>setMilestonesForm([...milestones,{count:1,reward:"custom"+Date.now(),label:"Yangi mukofot",days:1}]);

  // ── PRO SO'ROVLARI STATE ──
  const [proRequests,setProRequests]=useState(()=>[...PRO_REQUESTS]);
  const [refGrants,setRefGrants]=useState(()=>[...REFERRAL_GRANTS]);

  const approveProRequest=async (req)=>{
    if(token){
      try{
        await apiPost(`/admin/pro-requests/${req.id}/approve`, {}, token);
        await loadAdminBundle(token);
        setProRequests([...PRO_REQUESTS]);
        if(req.isMe && grantPro) grantPro(req.planDays||30);
        addToast?.(T.adminSuccess,"success");
      } catch(err){ console.error(err); }
      return;
    }
    PRO_REQUESTS = PRO_REQUESTS.map(r=>r.id===req.id?{...r,status:"approved"}:r);
    setProRequests([...PRO_REQUESTS]);
    if(req.isMe && grantPro) grantPro(req.planDays||30);
    savePersistedAdminData();
    addToast?.(T.adminSuccess,"success");
  };
  const rejectProRequest=async (req)=>{
    if(token){
      try{
        await apiPost(`/admin/pro-requests/${req.id}/reject`, {}, token);
        await loadAdminBundle(token);
        setProRequests([...PRO_REQUESTS]);
        addToast?.(T.adminDeleted,"success");
      } catch(err){ console.error(err); }
      return;
    }
    PRO_REQUESTS = PRO_REQUESTS.map(r=>r.id===req.id?{...r,status:"rejected"}:r);
    setProRequests([...PRO_REQUESTS]);
    if(req.isMe && setNotifs){
      const msg={
        uz:"To'lovingiz tasdiqlanmadi. Iltimos qaytadan urinib ko'ring yoki qo'llab-quvvatlash bilan bog'laning.",
        ru:"Ваш платёж не подтверждён. Попробуйте снова или обратитесь в поддержку.",
        kril:"Тўловингиз тасдиқланмади. Илтимос қайтадан уриниб кўринг ёки қўллаб-қувватлаш билан боғланинг.",
      };
      setNotifs(p=>[{id:Date.now(),type:"result",read:false,time:0,title:msg,body:msg},...p]);
    }
    savePersistedAdminData();
    addToast?.(T.adminDeleted,"success");
  };
  const approveRefGrant=async (g)=>{
    if(token){
      try{
        await apiPost(`/admin/referral-grants/${g.id}/approve`, {}, token);
        await loadAdminBundle(token);
        setRefGrants([...REFERRAL_GRANTS]);
        if(g.isMe && grantPro) grantPro(g.days);
        addToast?.(T.adminSuccess,"success");
      } catch(err){ console.error(err); }
      return;
    }
    REFERRAL_GRANTS = REFERRAL_GRANTS.map(r=>r.id===g.id?{...r,status:"approved"}:r);
    setRefGrants([...REFERRAL_GRANTS]);
    if(g.isMe && grantPro) grantPro(g.days);
    savePersistedAdminData();
    addToast?.(T.adminSuccess,"success");
  };


  const [adminList,setAdminList]=useState(()=>[...ADMINS]);
  const [editingAdmin,setEditingAdmin]=useState(null); // null | adminId (yangi qo'shish uchun "new")
  const [adminForm,setAdminForm]=useState({name:"",tgId:"",username:"",role:"content",perms:[...ADMIN_PERMS.content]});

  // Ruxsatlar ro'yxati — har biri alohida yoqilib/o'chirilishi mumkin
  const PERM_LIST=[
    {id:"tickets",       Icon:IC.Ticket,   labelKey:"adminTickets"},
    {id:"topics",        Icon:IC.Map,      labelKey:"adminTopics"},
    {id:"rules",         Icon:IC.Shield,   labelKey:"adminRules"},
    {id:"notifications", Icon:IC.Bell,     labelKey:"adminNotifs"},
    {id:"pro",           Icon:IC.Diamond,  labelKey:"adminPro"},
    {id:"admins",        Icon:IC.Users,    labelKey:"adminAdmins"},
  ];

  const openAddAdmin=()=>{
    setAdminForm({name:"",tgId:"",username:"",role:"content",perms:[...ADMIN_PERMS.content]});
    setEditingAdmin("new");
  };
  const openEditAdmin=(a)=>{
    setAdminForm({name:a.name,tgId:a.tgId,username:a.username||"",role:a.role,perms:[...(a.perms||ADMIN_PERMS[a.role]||[])]});
    setEditingAdmin(a.id);
  };
  const togglePerm=(permId)=>{
    const has=adminForm.perms.includes(permId);
    setAdminForm({...adminForm, perms: has ? adminForm.perms.filter(p=>p!==permId) : [...adminForm.perms,permId]});
  };
  const selectRole=(r)=>{
    setAdminForm({...adminForm, role:r, perms:[...ADMIN_PERMS[r]]});
  };
  const saveAdmin=async ()=>{
    if(!adminForm.name.trim()||!adminForm.tgId.trim()) return;
    if(token){
      try{
        if(editingAdmin==="new"){
          await apiPost("/admin/admins", {tgId:adminForm.tgId, name:adminForm.name, username:adminForm.username, role:adminForm.role, perms:adminForm.perms}, token);
        } else {
          await apiPatch(`/admin/admins/${editingAdmin}`, {name:adminForm.name, username:adminForm.username, role:adminForm.role, perms:adminForm.perms}, token);
        }
        await loadAdminBundle(token);
        setAdminList([...ADMINS]);
        addToast?.(T.adminSuccess,"success");
      } catch(err){ console.error(err); }
      setEditingAdmin(null);
      return;
    }
    if(editingAdmin==="new"){
      const adm={id:Date.now(), tgId:adminForm.tgId, name:adminForm.name, username:adminForm.username, role:adminForm.role, perms:adminForm.perms};
      ADMINS.push(adm);
    } else {
      ADMINS = ADMINS.map(a=>a.id===editingAdmin?{...a, tgId:adminForm.tgId, name:adminForm.name, username:adminForm.username, role:adminForm.role, perms:adminForm.perms}:a);
    }
    setAdminList([...ADMINS]);
    setEditingAdmin(null);
    savePersistedAdminData();
    addToast?.(T.adminSuccess,"success");
  };
  const removeAdmin=async (id)=>{
    if(token){
      try{
        await apiDelete(`/admin/admins/${id}`, token);
        await loadAdminBundle(token);
        setAdminList([...ADMINS]);
        addToast?.(T.adminDeleted,"success");
      } catch(err){ console.error(err); }
      return;
    }
    const supers = ADMINS.filter(a=>a.role==="super");
    const target = ADMINS.find(a=>a.id===id);
    if(target?.role==="super" && supers.length<=1) return; // oxirgi super adminni o'chirib bo'lmaydi
    ADMINS = ADMINS.filter(a=>a.id!==id);
    setAdminList([...ADMINS]);
    savePersistedAdminData();
    addToast?.(T.adminDeleted,"success");
  };

  // Admin panel ochilganda backend'dan to'liq ma'lumotni yuklaymiz (token mavjud bo'lsa)
  useEffect(() => {
    if(!token) return;
    loadAdminBundle(token).then(bundle => {
      if(!bundle) return;
      refreshAllLists();
      setPendingChanges([...PENDING_CHANGES]);
      setSentNotifs([...SENT_NOTIFICATIONS]);
      setProRequests([...PRO_REQUESTS]);
      setRefGrants([...REFERRAL_GRANTS]);
      setAdminList([...ADMINS]);
      if(bundle.dashboard) setDashboard(bundle.dashboard);
      bumpDataVersion?.();
    });
  }, [token]);

  // ── RENDER ──
  const StatCard=({Icon,val,label,color})=>(
    <div style={{flex:1,background:C.card,borderRadius:16,padding:"14px 12px",border:`1px solid ${C.cardBorder}`}}>
      <div style={{width:32,height:32,borderRadius:10,background:color+"18",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8}}>
        <Icon size={16} color={color}/>
      </div>
      <div style={{fontSize:18,fontWeight:900,color:C.text}}>{val}</div>
      <div style={{fontSize:10,color:C.subtext,marginTop:2}}>{label}</div>
    </div>
  );

  const proCount = tickets.filter(t=>t.isPro).length;
  const freeCount = tickets.length - proCount;

  // ── SAVOLLAR MUHARRIRI (full screen) ──
  if(editingQ){
    const q = editingQ.list[editingQ.qIdx];
    const langTabs=[["uz","UZ"],["ru","RU"],["kril","KRIL"]];
    return (
      <div style={{minHeight:"100vh",background:C.bg,paddingBottom:100}}>
        <div style={{background:`linear-gradient(135deg,#1E293B,#334155)`,padding:"52px 20px 16px"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
            <button onClick={()=>setEditingQ(null)} style={{background:"rgba(255,255,255,0.15)",border:"none",width:36,height:36,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <IC.ArrowLeft size={18} color="white"/>
            </button>
            <div style={{flex:1}}>
              <h2 style={{color:"white",fontSize:15,fontWeight:800,margin:0}}>{editingQ.refLabel}</h2>
              <p style={{color:"rgba(255,255,255,0.6)",fontSize:11,margin:0}}>{T.adminQuestionEditor}</p>
            </div>
          </div>
          {/* Question nav */}
          <div style={{display:"flex",alignItems:"center",gap:10,background:"rgba(255,255,255,0.1)",borderRadius:14,padding:"8px 12px"}}>
            <button onClick={()=>setEditingQ({...editingQ,qIdx:Math.max(0,editingQ.qIdx-1)})} disabled={editingQ.qIdx===0}
              style={{background:"rgba(255,255,255,0.15)",border:"none",width:28,height:28,borderRadius:8,cursor:editingQ.qIdx===0?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",opacity:editingQ.qIdx===0?0.4:1}}>
              <IC.ArrowLeft size={14} color="white"/>
            </button>
            <span style={{flex:1,textAlign:"center",color:"white",fontWeight:800,fontSize:13}}>{T.question} {editingQ.qIdx+1} / {editingQ.list.length}</span>
            <button onClick={()=>setEditingQ({...editingQ,qIdx:Math.min(editingQ.list.length-1,editingQ.qIdx+1)})} disabled={editingQ.qIdx===editingQ.list.length-1}
              style={{background:"rgba(255,255,255,0.15)",border:"none",width:28,height:28,borderRadius:8,cursor:editingQ.qIdx===editingQ.list.length-1?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",opacity:editingQ.qIdx===editingQ.list.length-1?0.4:1}}>
              <IC.ArrowRight size={14} color="white"/>
            </button>
          </div>
        </div>

        <div style={{padding:16}}>
          {/* Til tablari */}
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            {langTabs.map(([id,label])=>(
              <button key={id} onClick={()=>setEditingQ({...editingQ,elang:id})}
                style={{flex:1,padding:"9px 0",borderRadius:10,border:editingQ.elang===id?"none":`1px solid ${C.gray200}`,background:editingQ.elang===id?C.primary:"transparent",color:editingQ.elang===id?"white":C.subtext,fontSize:12,fontWeight:700,cursor:"pointer"}}>
                {label}
              </button>
            ))}
          </div>

          {/* Rasm */}
          <div style={{marginBottom:14}}>
            <label style={{fontSize:12,color:C.subtext,fontWeight:600,display:"block",marginBottom:6}}>{T.adminQuestionImage}</label>
            {q.image ? (
              <div style={{position:"relative",marginBottom:8}}>
                <img src={q.image} alt="" style={{width:"100%",maxHeight:180,objectFit:"contain",borderRadius:12,background:C.gray100,border:`1px solid ${C.cardBorder}`}}/>
                <button onClick={()=>updateCurrentQ("image",null)} style={{position:"absolute",top:8,right:8,background:"rgba(0,0,0,0.6)",border:"none",borderRadius:8,width:28,height:28,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <IC.Trash size={14} color="white"/>
                </button>
              </div>
            ) : (
              <label style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"14px",borderRadius:12,border:`1.5px dashed ${C.gray300}`,cursor:"pointer",color:C.subtext,fontSize:13,fontWeight:600}}>
                <IC.Plus size={16} color={C.subtext}/>{T.adminUploadImage}
                <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleImageUpload(e.target.files[0])}/>
              </label>
            )}
          </div>

          {/* Mavzu */}
          <div style={{marginBottom:14}}>
            <label style={{fontSize:12,color:C.subtext,fontWeight:600,display:"block",marginBottom:6}}>{T.adminQuestionTopic}</label>
            <select value={q.topicIndex===null?"":q.topicIndex} onChange={e=>updateCurrentQ("topicIndex",e.target.value===""?null:Number(e.target.value))}
              style={{width:"100%",boxSizing:"border-box",background:C.inputBg,borderRadius:12,padding:"11px 14px",border:`1.5px solid ${C.gray200}`,fontSize:14,color:C.text,outline:"none"}}>
              <option value="">{T.adminNoTopic}</option>
              {TOPICS_DATA.map((top,ti)=><option key={ti} value={ti}>{top.title[lang]||top.title.uz}</option>)}
            </select>
          </div>

          {/* Savol matni */}
          <div style={{marginBottom:14}}>
            <label style={{fontSize:12,color:C.subtext,fontWeight:600,display:"block",marginBottom:6}}>{T.adminQuestionText}</label>
            <textarea value={q.question[editingQ.elang]} onChange={e=>updateCurrentQ("question."+editingQ.elang,e.target.value)} rows={3}
              style={{width:"100%",boxSizing:"border-box",background:C.inputBg,borderRadius:12,padding:"11px 14px",border:`1.5px solid ${C.gray200}`,fontSize:14,color:C.text,outline:"none",resize:"vertical",fontFamily:"inherit"}}/>
          </div>

          {/* Variantlar */}
          <div style={{marginBottom:14}}>
            <label style={{fontSize:12,color:C.subtext,fontWeight:600,display:"block",marginBottom:6}}>{T.adminOptionsLabel}</label>
            {q.options[editingQ.elang].map((opt,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <div onClick={()=>updateCurrentQ("correct",i)} style={{flexShrink:0,width:28,height:28,borderRadius:"50%",border:`2px solid ${q.correct===i?C.success:C.gray300}`,background:q.correct===i?C.success:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontWeight:800,fontSize:12,color:q.correct===i?"white":C.gray400}}>
                  {String.fromCharCode(65+i)}
                </div>
                <input value={opt} onChange={e=>updateCurrentQ("option."+i,e.target.value)} placeholder={T.adminOptionPlaceholder+" "+String.fromCharCode(65+i)}
                  style={{flex:1,boxSizing:"border-box",background:C.inputBg,borderRadius:10,padding:"10px 12px",border:`1.5px solid ${q.correct===i?C.success:C.gray200}`,fontSize:13,color:C.text,outline:"none"}}/>
              </div>
            ))}
            <div style={{fontSize:11,color:C.subtext,marginTop:4}}>{T.adminCorrectHint}</div>
          </div>

          {/* Izoh */}
          <div style={{marginBottom:18}}>
            <label style={{fontSize:12,color:C.subtext,fontWeight:600,display:"block",marginBottom:6}}>{T.adminExplanationLabel}</label>
            <textarea value={q.explanation[editingQ.elang]||""} onChange={e=>updateCurrentQ("explanation."+editingQ.elang,e.target.value)} rows={3}
              style={{width:"100%",boxSizing:"border-box",background:C.inputBg,borderRadius:12,padding:"11px 14px",border:`1.5px solid ${C.gray200}`,fontSize:14,color:C.text,outline:"none",resize:"vertical",fontFamily:"inherit"}}/>
          </div>

          <div style={{display:"flex",gap:10,marginBottom:10}}>
            <button onClick={removeQuestion} disabled={editingQ.list.length<=1}
              style={{flex:1,padding:"12px",borderRadius:12,border:`1.5px solid ${C.danger}`,background:"transparent",color:C.danger,fontSize:13,fontWeight:700,cursor:editingQ.list.length<=1?"not-allowed":"pointer",opacity:editingQ.list.length<=1?0.4:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              <IC.Trash size={14} color={C.danger}/>{T.adminRemoveQuestion}
            </button>
            <button onClick={addQuestion}
              style={{flex:1,padding:"12px",borderRadius:12,border:`1.5px solid ${C.primary}`,background:"transparent",color:C.primary,fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              <IC.Plus size={14} color={C.primary}/>{T.adminAddQuestion}
            </button>
          </div>
        </div>

        {/* Sticky save */}
        <div style={{position:"fixed",bottom:0,left:0,right:0,padding:"12px 16px",background:C.bg,borderTop:`1px solid ${C.cardBorder}`}}>
          <button onClick={saveQuestionEditor} style={{width:"100%",padding:"14px",borderRadius:14,border:"none",background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,color:"white",fontWeight:800,fontSize:15,cursor:"pointer"}}>{T.adminSave}</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:"100vh",background:C.bg,paddingBottom:90}}>
      {/* Header */}
      <div style={{background:`linear-gradient(135deg,#1E293B,#334155)`,padding:"52px 20px 20px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
          <button onClick={()=>setScreen("profile")} style={{background:"rgba(255,255,255,0.15)",border:"none",width:36,height:36,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <IC.ArrowLeft size={18} color="white"/>
          </button>
          <div>
            <h2 style={{color:"white",fontSize:18,fontWeight:800,margin:0}}>{T.adminPanel}</h2>
            <p style={{color:"rgba(255,255,255,0.6)",fontSize:11,margin:0}}>{ADMIN_ROLES[user.adminRole]?.[lang]||ADMIN_ROLES[user.adminRole]?.uz}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <style>{`.admin-tabs-scroll::-webkit-scrollbar{display:none}`}</style>
      <div className="admin-tabs-scroll" style={{display:"flex",gap:8,padding:"14px 16px 0",overflowX:"auto",scrollbarWidth:"none",msOverflowStyle:"none"}}>
        {allTabs.map(t=>{
          const pendingCount = t.id==="changes"
            ? (isSuper ? pendingChanges.filter(c=>c.status==="pending").length : pendingChanges.filter(c=>c.status==="pending"&&String(c.adminTgId)===String(user?.tgId)).length)
            : 0;
          return (
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{flexShrink:0,padding:"8px 14px",borderRadius:14,border:tab===t.id?"none":`1px solid ${C.gray200}`,cursor:"pointer",background:tab===t.id?C.primary:"transparent",color:tab===t.id?"white":C.subtext,fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap",position:"relative"}}>
            <t.Icon size={14} color={tab===t.id?"white":C.subtext}/>{t.label}
            {pendingCount>0 && (
              <span style={{position:"absolute",top:-4,right:-4,minWidth:16,height:16,borderRadius:8,background:C.danger,color:"white",fontSize:9,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 3px"}}>{pendingCount}</span>
            )}
          </button>
        );})}
      </div>

      <div style={{padding:16}}>
        {/* ═══ DASHBOARD ═══ */}
        {tab==="dashboard" && (
          <>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              <StatCard Icon={IC.Users} val={dashboard?.totalUsers ?? "—"} label={T.adminTotalUsers} color="#1A6BFF"/>
              <StatCard Icon={IC.Ticket} val={tickets.length} label={T.adminTotalTickets} color="#8B5CF6"/>
              <StatCard Icon={IC.Diamond} val={dashboard?.proUsers ?? "—"} label={T.adminProUsers} color="#F59E0B"/>
              <StatCard Icon={IC.Map} val={TOPICS_DATA.length} label={T.adminTotalTopics} color="#22C55E"/>
            </div>
            <div style={{background:C.primary+"10",borderRadius:14,padding:14,border:`1px solid ${C.primary}30`,display:"flex",gap:10}}>
              <IC.Info size={18} color={C.primary}/>
              <div style={{fontSize:12,color:C.text,lineHeight:1.6}}>{T.adminQuestionPoolNote}</div>
            </div>
          </>
        )}

        {/* ═══ O'ZGARISHLAR ═══ */}
        {tab==="changes" && (() => {
          const visible = isSuper
            ? pendingChanges
            : pendingChanges.filter(c => c.adminTgId && String(c.adminTgId)===String(user?.tgId));
          const pending = visible.filter(c=>c.status==="pending");
          const resolved = visible.filter(c=>c.status!=="pending");
          const CHANGE_LABELS = {
            add_ticket: T.changeAddTicket, delete_ticket: T.changeDeleteTicket,
            toggle_ticket_pro: T.changeToggleTicketPro, edit_ticket_questions: T.changeEditQuestions,
            add_topic: T.changeAddTopic, delete_topic: T.changeDeleteTopic,
            add_rule_category: T.changeAddRuleCategory, add_rule_item: T.changeAddRuleItem,
            delete_rule_item: T.changeDeleteRuleItem,
          };
          return (
            <>
              <div style={{background:C.primary+"10",borderRadius:14,padding:14,border:`1px solid ${C.primary}30`,display:"flex",gap:10,marginBottom:14}}>
                <IC.Info size={18} color={C.primary}/>
                <div style={{fontSize:12,color:C.text,lineHeight:1.6}}>{isSuper?T.adminChangesQueueNote:T.adminMyChangesNote}</div>
              </div>

              <div style={{fontWeight:800,fontSize:14,color:C.text,marginBottom:10}}>{T.adminStatusPending}</div>
              {pending.length===0 ? (
                <div style={{fontSize:12,color:C.subtext,textAlign:"center",padding:"16px 0",marginBottom:14}}>{T.adminNoChanges}</div>
              ) : pending.map(c=>(
                <div key={c.id} style={{background:C.card,borderRadius:14,padding:"12px 14px",marginBottom:10,border:`1px solid ${C.cardBorder}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:6}}>
                    <span style={{fontSize:11,fontWeight:800,padding:"3px 8px",borderRadius:8,background:C.primary+"18",color:C.primary}}>{CHANGE_LABELS[c.type]||c.type}</span>
                    <span style={{fontSize:10,fontWeight:800,padding:"3px 8px",borderRadius:8,background:"#FEF3C7",color:"#92400E"}}>{T.adminStatusPending}</span>
                  </div>
                  <div style={{fontSize:13,color:C.text,fontWeight:600,marginBottom:4}}>{c.description}</div>
                  <div style={{fontSize:11,color:C.subtext,marginBottom:isSuper?10:0}}>{T.adminChangeBy} {c.adminName}</div>
                  {isSuper && c.type==="toggle_ticket_pro" && (
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:C.gray100,borderRadius:10,padding:"8px 12px",marginBottom:10}}>
                      <span style={{fontSize:12,fontWeight:600,color:C.text}}>{T.adminProTicket}</span>
                      <div onClick={()=>togglePendingProValue(c)} style={{width:40,height:24,borderRadius:12,background:c.payload.isPro?C.primary:C.gray300,position:"relative",cursor:"pointer",flexShrink:0}}>
                        <div style={{position:"absolute",top:2,left:c.payload.isPro?18:2,width:20,height:20,borderRadius:"50%",background:"white",transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/>
                      </div>
                    </div>
                  )}
                  {isSuper && (
                    <div style={{display:"flex",gap:8}}>
                      {(c.type==="add_ticket"||c.type==="edit_ticket_questions"||c.type==="add_topic"||c.type==="add_rule_category"||c.type==="add_rule_item") && (
                        <button onClick={()=>(c.type==="add_ticket"||c.type==="edit_ticket_questions")?openPendingQuestionEditor(c):openEditChangePayload(c)}
                          style={{padding:"9px 12px",borderRadius:10,border:`1px solid ${C.primary}40`,background:C.primary+"10",color:C.primary,fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
                          <IC.Edit size={13} color={C.primary}/>{T.adminEditChange}
                        </button>
                      )}
                      <button onClick={()=>rejectChange(c)} style={{flex:1,padding:"9px",borderRadius:10,border:`1.5px solid ${C.danger}`,background:"transparent",color:C.danger,fontSize:12,fontWeight:700,cursor:"pointer"}}>{T.adminReject}</button>
                      <button onClick={()=>approveChange(c)} style={{flex:1,padding:"9px",borderRadius:10,border:"none",background:C.success,color:"white",fontSize:12,fontWeight:700,cursor:"pointer"}}>{T.adminApprove}</button>
                    </div>
                  )}
                </div>
              ))}

              {resolved.length>0 && (
                <>
                  <div style={{fontWeight:800,fontSize:14,color:C.text,marginBottom:10,marginTop:8}}>{T.adminSentHistory}</div>
                  {resolved.map(c=>(
                    <div key={c.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderTop:`1px solid ${C.cardBorder}`}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:12,color:C.text}}>{c.description}</div>
                        <div style={{fontSize:10,color:C.subtext}}>{T.adminChangeBy} {c.adminName}</div>
                      </div>
                      <span style={{fontSize:10,fontWeight:800,padding:"3px 8px",borderRadius:8,background:c.status==="approved"?"#DCFCE7":"#FEE2E2",color:c.status==="approved"?"#166534":"#991B1B",whiteSpace:"nowrap"}}>
                        {c.status==="approved"?T.adminStatusApproved:T.adminStatusRejected}
                      </span>
                      {isSuper && c.status==="rejected" && (
                        <button onClick={()=>restoreChange(c)} title={T.adminRestoreChange} style={{background:"none",border:"none",cursor:"pointer",padding:4,flexShrink:0,display:"flex",alignItems:"center"}}>
                          <IC.RotateCcw size={14} color={C.primary}/>
                        </button>
                      )}
                    </div>
                  ))}
                </>
              )}

              {/* Oddiy maydonli o'zgarishlarni (mavzu/toifa/belgi) tahrirlash modali */}
              {editingChangePayload && (
                <AdminModal title={T.adminEditChange} onClose={()=>setEditingChangePayload(null)} onSave={saveEditChangePayload} C={C} T={T}>
                  {editingChangePayload.change.type==="add_topic" && (
                    <>
                      <AdminInput label={T.adminTopicName+" (UZ)"} value={editingChangePayload.form.uz} onChange={v=>setEditingChangePayload({...editingChangePayload,form:{...editingChangePayload.form,uz:v}})} C={C}/>
                      <AdminInput label={T.adminTopicName+" (RU)"} value={editingChangePayload.form.ru} onChange={v=>setEditingChangePayload({...editingChangePayload,form:{...editingChangePayload.form,ru:v}})} C={C}/>
                      <AdminInput label={T.adminTopicName+" (KRIL)"} value={editingChangePayload.form.kril} onChange={v=>setEditingChangePayload({...editingChangePayload,form:{...editingChangePayload.form,kril:v}})} C={C}/>
                      <div style={{marginBottom:12}}>
                        <label style={{fontSize:12,color:C.subtext,fontWeight:600,display:"block",marginBottom:6}}>{T.adminTopicColor}</label>
                        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                          {ADMIN_COLORS.map(c=>(
                            <div key={c} onClick={()=>setEditingChangePayload({...editingChangePayload,form:{...editingChangePayload.form,color:c}})} style={{width:28,height:28,borderRadius:8,background:c,cursor:"pointer",border:editingChangePayload.form.color===c?`3px solid ${C.text}`:"2px solid transparent"}}/>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  {editingChangePayload.change.type==="add_rule_category" && (
                    <>
                      <AdminInput label={T.adminRuleCategoryName+" (UZ)"} value={editingChangePayload.form.uz} onChange={v=>setEditingChangePayload({...editingChangePayload,form:{...editingChangePayload.form,uz:v}})} C={C}/>
                      <AdminInput label={T.adminRuleCategoryName+" (RU)"} value={editingChangePayload.form.ru} onChange={v=>setEditingChangePayload({...editingChangePayload,form:{...editingChangePayload.form,ru:v}})} C={C}/>
                      <AdminInput label={T.adminRuleCategoryName+" (KRIL)"} value={editingChangePayload.form.kril} onChange={v=>setEditingChangePayload({...editingChangePayload,form:{...editingChangePayload.form,kril:v}})} C={C}/>
                      <div style={{marginBottom:12}}>
                        <label style={{fontSize:12,color:C.subtext,fontWeight:600,display:"block",marginBottom:6}}>{T.adminTopicColor}</label>
                        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                          {ADMIN_COLORS.map(c=>(
                            <div key={c} onClick={()=>setEditingChangePayload({...editingChangePayload,form:{...editingChangePayload.form,color:c}})} style={{width:28,height:28,borderRadius:8,background:c,cursor:"pointer",border:editingChangePayload.form.color===c?`3px solid ${C.text}`:"2px solid transparent"}}/>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  {editingChangePayload.change.type==="add_rule_item" && (
                    <>
                      {editingChangePayload.form.image && (
                        <img src={editingChangePayload.form.image} alt="" style={{width:"100%",maxHeight:140,objectFit:"contain",borderRadius:12,background:C.gray100,border:`1px solid ${C.cardBorder}`,marginBottom:12}}/>
                      )}
                      <AdminInput label={T.adminAddRuleItem+" (UZ)"} value={editingChangePayload.form.uz} onChange={v=>setEditingChangePayload({...editingChangePayload,form:{...editingChangePayload.form,uz:v}})} C={C}/>
                      <AdminInput label={T.adminAddRuleItem+" (RU)"} value={editingChangePayload.form.ru} onChange={v=>setEditingChangePayload({...editingChangePayload,form:{...editingChangePayload.form,ru:v}})} C={C}/>
                      <AdminInput label={T.adminAddRuleItem+" (KRIL)"} value={editingChangePayload.form.kril} onChange={v=>setEditingChangePayload({...editingChangePayload,form:{...editingChangePayload.form,kril:v}})} C={C}/>
                      <AdminInput label={T.adminRuleDesc+" (UZ)"} value={editingChangePayload.form.descUz} onChange={v=>setEditingChangePayload({...editingChangePayload,form:{...editingChangePayload.form,descUz:v}})} C={C}/>
                      <AdminInput label={T.adminRuleDesc+" (RU)"} value={editingChangePayload.form.descRu} onChange={v=>setEditingChangePayload({...editingChangePayload,form:{...editingChangePayload.form,descRu:v}})} C={C}/>
                      <AdminInput label={T.adminRuleDesc+" (KRIL)"} value={editingChangePayload.form.descKril} onChange={v=>setEditingChangePayload({...editingChangePayload,form:{...editingChangePayload.form,descKril:v}})} C={C}/>
                    </>
                  )}
                </AdminModal>
              )}
            </>
          );
        })()}
        {tab==="tickets" && (
          <>
            <div style={{display:"flex",gap:10,marginBottom:14}}>
              <StatCard Icon={IC.Ticket} val={ticketList.length} label={T.adminAll} color="#1A6BFF"/>
              <StatCard Icon={IC.CheckCircle} val={freeCount} label={T.adminFreeTicket} color="#22C55E"/>
              <StatCard Icon={IC.Diamond} val={proCount} label={T.adminProTicket} color="#F59E0B"/>
            </div>
            <button onClick={()=>setShowAddTicket(true)} style={{width:"100%",padding:"13px",borderRadius:14,border:"none",background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,color:"white",fontWeight:800,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:14}}>
              <IC.Plus size={16} color="white"/>{T.adminAddTicket}
            </button>
            <div style={{maxHeight:480,overflowY:"auto",display:"flex",flexDirection:"column",gap:8}}>
              {ticketList.map(t=>(
                <div key={t.id} style={{background:C.card,borderRadius:14,padding:"12px 14px",border:`1px solid ${C.cardBorder}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                    <div style={{width:36,height:36,borderRadius:10,background:(t.isPro?"#F59E0B":"#22C55E")+"18",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,color:t.isPro?"#F59E0B":"#22C55E"}}>{t.id}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:13,color:C.text}}>{T.ticket} {t.id}</div>
                      <div style={{fontSize:11,color:C.subtext}}>{t.qCount} {T.questions}</div>
                    </div>
                    <span style={{fontSize:10,fontWeight:800,padding:"4px 8px",borderRadius:8,background:t.isPro?"#FEF3C7":"#DCFCE7",color:t.isPro?"#92400E":"#166534"}}>{t.isPro?"PRO":T.adminFreeTicket.split(" ")[0]}</span>
                    <div onClick={()=>toggleTicketPro(t.id)} style={{width:40,height:24,borderRadius:12,background:t.isPro?C.primary:C.gray300,position:"relative",cursor:"pointer",flexShrink:0}}>
                      <div style={{position:"absolute",top:2,left:t.isPro?18:2,width:20,height:20,borderRadius:"50%",background:"white",transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/>
                    </div>
                    <button onClick={()=>deleteTicket(t.id)} style={{background:"none",border:"none",cursor:"pointer",padding:4,flexShrink:0}}>
                      <IC.Trash size={16} color={C.danger}/>
                    </button>
                  </div>
                  <button onClick={()=>openTicketEditor(t.id)} style={{width:"100%",padding:"9px",borderRadius:10,border:`1px solid ${C.primary}40`,background:C.primary+"10",color:C.primary,fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                    <IC.Edit size={13} color={C.primary}/>{T.adminEditQuestions}
                  </button>
                </div>
              ))}
            </div>
            {showAddTicket && (
              <AdminModal title={T.adminAddTicket} onClose={()=>setShowAddTicket(false)} onSave={addTicket} C={C} T={T}>
                <AdminInput label={T.adminTicketNumber} value={tickets.length?Math.max(...tickets.map(t=>t.id))+1:1} onChange={()=>{}} C={C} type="number"/>
                <AdminInput label={T.adminQuestionCount} value={newTicketQCount} onChange={setNewTicketQCount} C={C} type="number"/>
                <AdminToggle checked={newTicketPro} onChange={setNewTicketPro} C={C} label={T.adminProTicket}/>
              </AdminModal>
            )}
          </>
        )}

        {/* ═══ TOPICS ═══ */}
        {tab==="topics" && (
          <>
            <button onClick={()=>setShowAddTopic(true)} style={{width:"100%",padding:"13px",borderRadius:14,border:"none",background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,color:"white",fontWeight:800,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:14}}>
              <IC.Plus size={16} color="white"/>{T.adminAddTopic}
            </button>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {topicList.map((topic,i)=>{
                const taggedCount = tickets.reduce((sum,t)=>sum+t.questions.filter(q=>q.topicIndex===i).length,0);
                return (
                <div key={i} style={{background:C.card,borderRadius:14,padding:"12px 14px",display:"flex",alignItems:"center",gap:10,border:`1px solid ${C.cardBorder}`}}>
                  <div style={{width:36,height:36,borderRadius:10,background:topic.bg,flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:13,color:C.text}}>{topic.title[lang]||topic.title.uz}</div>
                    <div style={{fontSize:11,color:C.subtext}}>{taggedCount} {T.questions}</div>
                  </div>
                  <button onClick={()=>deleteTopic(i)} style={{background:"none",border:"none",cursor:"pointer",padding:4}}>
                    <IC.Trash size={16} color={C.danger}/>
                  </button>
                </div>
              );})}
            </div>
            {showAddTopic && (
              <AdminModal title={T.adminAddTopic} onClose={()=>setShowAddTopic(false)} onSave={addTopic} C={C} T={T}>
                <AdminInput label={T.adminTopicName+" (UZ)"} value={newTopic.uz} onChange={v=>setNewTopic({...newTopic,uz:v})} C={C}/>
                <AdminInput label={T.adminTopicName+" (RU)"} value={newTopic.ru} onChange={v=>setNewTopic({...newTopic,ru:v})} C={C}/>
                <AdminInput label={T.adminTopicName+" (KRIL)"} value={newTopic.kril} onChange={v=>setNewTopic({...newTopic,kril:v})} C={C}/>
                <div style={{marginBottom:12}}>
                  <label style={{fontSize:12,color:C.subtext,fontWeight:600,display:"block",marginBottom:6}}>{T.adminTopicColor}</label>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {ADMIN_COLORS.map(c=>(
                      <div key={c} onClick={()=>setNewTopic({...newTopic,color:c})} style={{width:28,height:28,borderRadius:8,background:c,cursor:"pointer",border:newTopic.color===c?`3px solid ${C.text}`:"2px solid transparent"}}/>
                    ))}
                  </div>
                </div>
              </AdminModal>
            )}
          </>
        )}

        {/* ═══ RULES ═══ */}
        {tab==="rules" && (
          <>
            <button onClick={()=>setShowAddCat(true)} style={{width:"100%",padding:"13px",borderRadius:14,border:"none",background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,color:"white",fontWeight:800,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:14}}>
              <IC.Plus size={16} color="white"/>{T.adminAddRuleCategory}
            </button>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {ruleCats.map((cat,ci)=>(
                <div key={cat.id} style={{background:C.card,borderRadius:14,border:`1px solid ${C.cardBorder}`,overflow:"hidden"}}>
                  <div onClick={()=>setExpandedCat(expandedCat===ci?null:ci)} style={{padding:"12px 14px",display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
                    <div style={{width:36,height:36,borderRadius:10,background:cat.bg,flexShrink:0}}/>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:13,color:C.text}}>{cat.title[lang]||cat.title.uz}</div>
                      <div style={{fontSize:11,color:C.subtext}}>{cat.items.length} {T.questions}</div>
                    </div>
                    <IC.ChevronRight size={16} color={C.gray400} style={{transform:expandedCat===ci?"rotate(90deg)":"none",transition:"transform 0.2s"}}/>
                  </div>
                  {expandedCat===ci && (
                    <div style={{padding:"0 14px 14px"}}>
                      {cat.items.map((it,ii)=>(
                        <div key={ii} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderTop:`1px solid ${C.cardBorder}`}}>
                          {it.image && <img src={it.image} alt="" style={{width:32,height:32,objectFit:"contain",borderRadius:6,background:C.gray100,flexShrink:0}}/>}
                          <span style={{flex:1,fontSize:12,color:C.text}}>{it[lang]||it.uz}</span>
                          <button onClick={()=>deleteRuleItem(ci,ii)} style={{background:"none",border:"none",cursor:"pointer",padding:2}}>
                            <IC.Trash size={14} color={C.danger}/>
                          </button>
                        </div>
                      ))}
                      <div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${C.cardBorder}`}}>
                        <div style={{marginBottom:12}}>
                          <label style={{fontSize:12,color:C.subtext,fontWeight:600,display:"block",marginBottom:6}}>{T.adminQuestionImage}</label>
                          {newItemText.image ? (
                            <div style={{position:"relative",marginBottom:8}}>
                              <img src={newItemText.image} alt="" style={{width:"100%",maxHeight:140,objectFit:"contain",borderRadius:12,background:C.gray100,border:`1px solid ${C.cardBorder}`}}/>
                              <button onClick={()=>setNewItemText({...newItemText,image:null})} style={{position:"absolute",top:8,right:8,background:"rgba(0,0,0,0.6)",border:"none",borderRadius:8,width:28,height:28,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                                <IC.Trash size={14} color="white"/>
                              </button>
                            </div>
                          ) : (
                            <label style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"14px",borderRadius:12,border:`1.5px dashed ${C.gray300}`,cursor:"pointer",color:C.subtext,fontSize:13,fontWeight:600}}>
                              <IC.Plus size={16} color={C.subtext}/>{T.adminUploadImage}
                              <input type="file" accept="image/*" style={{display:"none"}} onChange={async e=>{
                                const file=e.target.files[0];
                                if(!file) return;
                                const url = await uploadAdminImage(file);
                                if(url) setNewItemText({...newItemText,image:url});
                              }}/>
                            </label>
                          )}
                        </div>
                        <AdminInput label={T.adminAddRuleItem+" (UZ)"} value={newItemText.uz} onChange={v=>setNewItemText({...newItemText,uz:v})} C={C}/>
                        <AdminInput label={T.adminAddRuleItem+" (RU)"} value={newItemText.ru} onChange={v=>setNewItemText({...newItemText,ru:v})} C={C}/>
                        <AdminInput label={T.adminAddRuleItem+" (KRIL)"} value={newItemText.kril} onChange={v=>setNewItemText({...newItemText,kril:v})} C={C}/>
                        <AdminInput label={T.adminRuleDesc+" (UZ)"} value={newItemText.descUz} onChange={v=>setNewItemText({...newItemText,descUz:v})} C={C}/>
                        <AdminInput label={T.adminRuleDesc+" (RU)"} value={newItemText.descRu} onChange={v=>setNewItemText({...newItemText,descRu:v})} C={C}/>
                        <AdminInput label={T.adminRuleDesc+" (KRIL)"} value={newItemText.descKril} onChange={v=>setNewItemText({...newItemText,descKril:v})} C={C}/>
                        <button onClick={()=>addRuleItem(ci)} style={{width:"100%",padding:"11px",borderRadius:12,border:"none",background:C.primary,color:"white",fontWeight:700,fontSize:13,cursor:"pointer"}}>{T.adminAddBtn}</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {showAddCat && (
              <AdminModal title={T.adminAddRuleCategory} onClose={()=>setShowAddCat(false)} onSave={addCategory} C={C} T={T}>
                <AdminInput label={T.adminRuleCategoryName+" (UZ)"} value={newCat.uz} onChange={v=>setNewCat({...newCat,uz:v})} C={C}/>
                <AdminInput label={T.adminRuleCategoryName+" (RU)"} value={newCat.ru} onChange={v=>setNewCat({...newCat,ru:v})} C={C}/>
                <AdminInput label={T.adminRuleCategoryName+" (KRIL)"} value={newCat.kril} onChange={v=>setNewCat({...newCat,kril:v})} C={C}/>
                <div style={{marginBottom:12}}>
                  <label style={{fontSize:12,color:C.subtext,fontWeight:600,display:"block",marginBottom:6}}>{T.adminTopicColor}</label>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {ADMIN_COLORS.map(c=>(
                      <div key={c} onClick={()=>setNewCat({...newCat,color:c})} style={{width:28,height:28,borderRadius:8,background:c,cursor:"pointer",border:newCat.color===c?`3px solid ${C.text}`:"2px solid transparent"}}/>
                    ))}
                  </div>
                </div>
              </AdminModal>
            )}
          </>
        )}

        {/* ═══ NOTIFICATIONS ═══ */}
        {tab==="notifs" && (
          <>
            <div style={{background:C.card,borderRadius:16,padding:16,border:`1px solid ${C.cardBorder}`,marginBottom:14}}>
              <div style={{fontWeight:800,fontSize:14,color:C.text,marginBottom:12}}>{T.adminSendNotif}</div>
              <div style={{marginBottom:12}}>
                <label style={{fontSize:12,color:C.subtext,fontWeight:600,display:"block",marginBottom:6}}>{T.adminNotifType}</label>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {notifTypes.map(nt=>(
                    <button key={nt.id} onClick={()=>setNotifForm({...notifForm,type:nt.id})}
                      style={{padding:"7px 12px",borderRadius:10,border:notifForm.type===nt.id?"none":`1px solid ${C.gray200}`,background:notifForm.type===nt.id?C.primary:"transparent",color:notifForm.type===nt.id?"white":C.subtext,fontSize:12,fontWeight:600,cursor:"pointer"}}>
                      {nt.label}
                    </button>
                  ))}
                </div>
              </div>
              <AdminInput label={T.adminNotifTitle+" (UZ)"} value={notifForm.titleUz} onChange={v=>setNotifForm({...notifForm,titleUz:v})} C={C}/>
              <AdminInput label={T.adminNotifTitle+" (RU)"} value={notifForm.titleRu} onChange={v=>setNotifForm({...notifForm,titleRu:v})} C={C}/>
              <AdminInput label={T.adminNotifTitle+" (KRIL)"} value={notifForm.titleKril} onChange={v=>setNotifForm({...notifForm,titleKril:v})} C={C}/>
              <AdminInput label={T.adminNotifBody+" (UZ)"} value={notifForm.bodyUz} onChange={v=>setNotifForm({...notifForm,bodyUz:v})} C={C}/>
              <AdminInput label={T.adminNotifBody+" (RU)"} value={notifForm.bodyRu} onChange={v=>setNotifForm({...notifForm,bodyRu:v})} C={C}/>
              <AdminInput label={T.adminNotifBody+" (KRIL)"} value={notifForm.bodyKril} onChange={v=>setNotifForm({...notifForm,bodyKril:v})} C={C}/>
              <button onClick={sendNotification} style={{width:"100%",padding:"13px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,color:"white",fontWeight:800,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <IC.Send size={16} color="white"/>{T.adminSendBtn}
              </button>
            </div>
            {sentNotifs.length>0 && (
              <div>
                <div style={{fontWeight:800,fontSize:14,color:C.text,marginBottom:10}}>{T.adminSentHistory}</div>
                {sentNotifs.map(n=>(
                  <div key={n.id} style={{background:C.card,borderRadius:12,padding:"10px 14px",marginBottom:8,border:`1px solid ${C.cardBorder}`}}>
                    <div style={{fontWeight:700,fontSize:13,color:C.text}}>{n.title[lang]||n.title.uz}</div>
                    <div style={{fontSize:12,color:C.subtext,marginTop:2}}>{n.body[lang]||n.body.uz}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ═══ PRO / DISCOUNT ═══ */}
        {tab==="pro" && (
          <>
            {/* Pro obuna so'rovlari */}
            <div style={{background:C.card,borderRadius:16,padding:16,border:`1px solid ${C.cardBorder}`,marginBottom:14}}>
              <div style={{fontWeight:800,fontSize:14,color:C.text,marginBottom:12}}>{T.adminProRequests}</div>
              {proRequests.filter(r=>r.status==="pending").length===0 ? (
                <div style={{fontSize:12,color:C.subtext,textAlign:"center",padding:"8px 0"}}>{T.adminNoRequests}</div>
              ) : proRequests.filter(r=>r.status==="pending").map(r=>(
                <div key={r.id} style={{borderRadius:14,padding:"12px 14px",marginBottom:10,background:C.bg,border:`1px solid ${C.cardBorder}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                    <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#F59E0B,#EF4444)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"white",fontSize:14,flexShrink:0}}>{r.name[0]}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:700,fontSize:13,color:C.text}}>{r.name}</div>
                      <div style={{fontSize:11,color:C.subtext}}>{r.username?"@"+r.username:r.tgId}</div>
                    </div>
                    <span style={{fontSize:10,fontWeight:800,padding:"4px 8px",borderRadius:8,background:"#FEF3C7",color:"#92400E"}}>{T.adminStatusPending}</span>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.subtext,marginBottom:4}}>
                    <span>{T.adminProRequestPlan}</span><span style={{fontWeight:700,color:C.text}}>{T[r.planLabel]||r.planLabel}</span>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.subtext,marginBottom:4}}>
                    <span>{T.adminProRequestAmount}</span><span style={{fontWeight:700,color:C.text}}>{r.amount} so'm</span>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.subtext,marginBottom:10}}>
                    <span>{T.adminProRequestReceipt}</span>
                  </div>
                  {r.receiptPreview ? (
                    r.receiptType?.startsWith("image/") ? (
                      <img src={r.receiptPreview} alt="chek" style={{width:"100%",maxHeight:220,objectFit:"contain",borderRadius:10,marginBottom:10,background:C.gray100,border:`1px solid ${C.cardBorder}`}}/>
                    ) : (
                      <div style={{display:"flex",alignItems:"center",gap:8,background:C.gray100,borderRadius:10,padding:"10px 12px",marginBottom:10}}>
                        <IC.FileText size={18} color={C.primary}/>
                        <a href={r.receiptPreview} target="_blank" rel="noreferrer" style={{fontSize:12,color:C.primary,fontWeight:600,textDecoration:"none"}}>{r.receiptName}</a>
                      </div>
                    )
                  ) : (
                    <div style={{fontSize:12,color:C.subtext,marginBottom:10}}>—</div>
                  )}
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>rejectProRequest(r)} style={{flex:1,padding:"10px",borderRadius:10,border:`1.5px solid ${C.danger}`,background:"transparent",color:C.danger,fontSize:12,fontWeight:700,cursor:"pointer"}}>{T.adminReject}</button>
                    <button onClick={()=>approveProRequest(r)} style={{flex:1,padding:"10px",borderRadius:10,border:"none",background:C.success,color:"white",fontSize:12,fontWeight:700,cursor:"pointer"}}>{T.adminApprove}</button>
                  </div>
                </div>
              ))}
              {proRequests.filter(r=>r.status!=="pending").map(r=>(
                <div key={r.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderTop:`1px solid ${C.cardBorder}`}}>
                  <div style={{flex:1,fontSize:12,color:C.text}}>{r.name} — {T[r.planLabel]||r.planLabel}</div>
                  <span style={{fontSize:10,fontWeight:800,padding:"3px 8px",borderRadius:8,background:r.status==="approved"?"#DCFCE7":"#FEE2E2",color:r.status==="approved"?"#166534":"#991B1B"}}>
                    {r.status==="approved"?T.adminStatusApproved:T.adminStatusRejected}
                  </span>
                </div>
              ))}
            </div>

            {/* Referal orqali Pro berish */}
            <div style={{background:C.card,borderRadius:16,padding:16,border:`1px solid ${C.cardBorder}`,marginBottom:14}}>
              <div style={{fontWeight:800,fontSize:14,color:C.text,marginBottom:12}}>{T.adminRefGrants}</div>
              {refGrants.filter(g=>g.status==="pending").length===0 ? (
                <div style={{fontSize:12,color:C.subtext,textAlign:"center",padding:"8px 0"}}>{T.adminNoRequests}</div>
              ) : refGrants.filter(g=>g.status==="pending").map(g=>(
                <div key={g.id} style={{display:"flex",alignItems:"center",gap:10,borderRadius:14,padding:"10px 12px",marginBottom:8,background:C.bg,border:`1px solid ${C.cardBorder}`}}>
                  <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#1A6BFF,#6366F1)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"white",fontSize:14,flexShrink:0}}>{g.name[0]}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:13,color:C.text}}>{g.name}</div>
                    <div style={{fontSize:11,color:C.subtext}}>{g.milestoneLabel}</div>
                  </div>
                  <button onClick={()=>approveRefGrant(g)} style={{padding:"9px 14px",borderRadius:10,border:"none",background:C.primary,color:"white",fontSize:12,fontWeight:700,cursor:"pointer",flexShrink:0}}>{T.adminRefGrantBtn}</button>
                </div>
              ))}
              {refGrants.filter(g=>g.status!=="pending").map(g=>(
                <div key={g.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderTop:`1px solid ${C.cardBorder}`}}>
                  <div style={{flex:1,fontSize:12,color:C.text}}>{g.name} — {g.milestoneLabel}</div>
                  <span style={{fontSize:10,fontWeight:800,padding:"3px 8px",borderRadius:8,background:"#DCFCE7",color:"#166534"}}>{T.adminStatusApproved}</span>
                </div>
              ))}
            </div>

            <div style={{background:C.card,borderRadius:16,padding:16,border:`1px solid ${C.cardBorder}`,marginBottom:14}}>
              <div style={{fontWeight:800,fontSize:14,color:C.text,marginBottom:12}}>{T.discountLabel}</div>
              <AdminToggle checked={discount.active} onChange={v=>setDiscountForm({...discount,active:v})} C={C} label={T.adminDiscountActive}/>
              <AdminInput label={T.adminDiscountPercent} value={discount.percent} onChange={v=>setDiscountForm({...discount,percent:v})} C={C} type="number"/>
              <AdminInput label={T.adminDiscountEnd} value={discount.endDate} onChange={v=>setDiscountForm({...discount,endDate:v})} C={C} type="date"/>
            </div>
            <div style={{background:C.card,borderRadius:16,padding:16,border:`1px solid ${C.cardBorder}`,marginBottom:14}}>
              <div style={{fontWeight:800,fontSize:14,color:C.text,marginBottom:12}}>{T.adminPricesTitle}</div>
              <AdminInput label={T.proWeekly} value={prices.week} onChange={v=>setPricesForm({...prices,week:v})} C={C} type="number"/>
              <AdminInput label={T.proMonth1} value={prices.month1} onChange={v=>setPricesForm({...prices,month1:v})} C={C} type="number"/>
              <AdminInput label={T.proMonth2} value={prices.month2} onChange={v=>setPricesForm({...prices,month2:v})} C={C} type="number"/>
            </div>
            <div style={{background:C.card,borderRadius:16,padding:16,border:`1px solid ${C.cardBorder}`,marginBottom:14}}>
              <div style={{fontWeight:800,fontSize:14,color:C.text,marginBottom:12}}>{T.adminLimitsTitle}</div>
              <AdminInput label={T.adminFreeExamLimit} value={limits.freeExamCount} onChange={v=>setLimitsForm({...limits,freeExamCount:v})} C={C} type="number"/>
              <AdminInput label={T.adminFreeTestLimit} value={limits.dailyTestLimit} onChange={v=>setLimitsForm({...limits,dailyTestLimit:v})} C={C} type="number"/>
              <AdminInput label={T.adminFreeTicketLimit} value={limits.freeTicketCount} onChange={v=>setLimitsForm({...limits,freeTicketCount:v})} C={C} type="number"/>
            </div>
            <div style={{background:C.card,borderRadius:16,padding:16,border:`1px solid ${C.cardBorder}`,marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <span style={{fontWeight:800,fontSize:14,color:C.text}}>{T.adminRefMilestones}</span>
                <button onClick={addMilestone} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",padding:4}}><IC.Plus size={18} color={C.primary}/></button>
              </div>
              {milestones.map((m,i)=>(
                <div key={i} style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}>
                  <div style={{flex:1}}>
                    <AdminInput label={T.adminRefCount} value={m.count} onChange={v=>updateMilestone(i,"count",v)} C={C} type="number"/>
                  </div>
                  <div style={{flex:1}}>
                    <AdminInput label={T.adminRefDays} value={m.days} onChange={v=>updateMilestone(i,"days",v)} C={C} type="number"/>
                  </div>
                  <button onClick={()=>removeMilestone(i)} style={{background:"none",border:"none",cursor:"pointer",padding:4,marginTop:18}}>
                    <IC.Trash size={16} color={C.danger}/>
                  </button>
                </div>
              ))}
            </div>
            <button onClick={saveProSettings} style={{width:"100%",padding:"14px",borderRadius:14,border:"none",background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,color:"white",fontWeight:800,fontSize:15,cursor:"pointer"}}>{T.adminSave}</button>
          </>
        )}

        {/* ═══ ADMINS ═══ */}
        {tab==="admins" && (
          <>
            <button onClick={openAddAdmin} style={{width:"100%",padding:"13px",borderRadius:14,border:"none",background:`linear-gradient(135deg,${C.gradStart},${C.gradEnd})`,color:"white",fontWeight:800,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:14}}>
              <IC.Plus size={16} color="white"/>{T.adminAddAdmin}
            </button>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {adminList.map(a=>{
                const perms=a.perms||ADMIN_PERMS[a.role]||[];
                return (
                <div key={a.id} style={{background:C.card,borderRadius:14,padding:"12px 14px",border:`1px solid ${C.cardBorder}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                    <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#1A6BFF,#6366F1)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"white",fontSize:14,flexShrink:0}}>{a.name[0]}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:700,fontSize:13,color:C.text}}>{a.name}</div>
                      <div style={{fontSize:11,color:C.subtext}}>{a.username?"@"+a.username:a.tgId}</div>
                    </div>
                    <span style={{fontSize:10,fontWeight:700,padding:"4px 8px",borderRadius:8,background:C.primary+"18",color:C.primary,whiteSpace:"nowrap"}}>{ADMIN_ROLES[a.role]?.[lang]||ADMIN_ROLES[a.role]?.uz}</span>
                  </div>
                  {/* Ruxsatlar belgilari */}
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
                    {PERM_LIST.map(p=>{
                      const active=perms.includes(p.id);
                      return (
                        <div key={p.id} title={T[p.labelKey]} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 8px",borderRadius:8,background:active?C.success+"18":C.gray100,opacity:active?1:0.4}}>
                          <p.Icon size={12} color={active?C.success:C.gray400}/>
                          <span style={{fontSize:10,fontWeight:600,color:active?C.success:C.gray400}}>{T[p.labelKey]}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>openEditAdmin(a)} style={{flex:1,padding:"9px",borderRadius:10,border:`1px solid ${C.primary}40`,background:C.primary+"10",color:C.primary,fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                      <IC.Edit size={13} color={C.primary}/>{T.adminEditAdmin}
                    </button>
                    <button onClick={()=>removeAdmin(a.id)} style={{padding:"9px 14px",borderRadius:10,border:`1px solid ${C.danger}40`,background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <IC.Trash size={14} color={C.danger}/>
                    </button>
                  </div>
                </div>
              );})}
            </div>
            {editingAdmin!==null && (
              <AdminModal title={editingAdmin==="new"?T.adminAddAdmin:T.adminEditAdmin} onClose={()=>setEditingAdmin(null)} onSave={saveAdmin} C={C} T={T}>
                <AdminInput label={T.adminAdminName} value={adminForm.name} onChange={v=>setAdminForm({...adminForm,name:v})} C={C}/>
                <AdminInput label={T.adminAdminTgId} value={adminForm.tgId} onChange={v=>setAdminForm({...adminForm,tgId:v})} C={C}/>
                <AdminInput label="Username" value={adminForm.username} onChange={v=>setAdminForm({...adminForm,username:v})} C={C} placeholder="username"/>
                <div style={{marginBottom:12}}>
                  <label style={{fontSize:12,color:C.subtext,fontWeight:600,display:"block",marginBottom:6}}>{T.adminAdminRole}</label>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {Object.keys(ADMIN_ROLES).map(r=>(
                      <button key={r} onClick={()=>selectRole(r)}
                        style={{padding:"8px 14px",borderRadius:10,border:adminForm.role===r?"none":`1px solid ${C.gray200}`,background:adminForm.role===r?C.primary:"transparent",color:adminForm.role===r?"white":C.subtext,fontSize:12,fontWeight:600,cursor:"pointer"}}>
                        {ADMIN_ROLES[r][lang]||ADMIN_ROLES[r].uz}
                      </button>
                    ))}
                  </div>
                  <div style={{fontSize:11,color:C.subtext,marginTop:6}}>{T.adminRolePresetHint}</div>
                </div>
                <div style={{marginBottom:4}}>
                  <label style={{fontSize:12,color:C.subtext,fontWeight:600,display:"block",marginBottom:6}}>{T.adminPermissions}</label>
                  {PERM_LIST.map(p=>{
                    const active=adminForm.perms.includes(p.id);
                    return (
                      <div key={p.id} onClick={()=>togglePerm(p.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,background:active?C.success+"10":C.gray100,marginBottom:6,cursor:"pointer",border:`1px solid ${active?C.success+"40":"transparent"}`}}>
                        <p.Icon size={16} color={active?C.success:C.gray400}/>
                        <span style={{flex:1,fontSize:13,fontWeight:600,color:active?C.text:C.subtext}}>{T[p.labelKey]}</span>
                        <div style={{width:36,height:21,borderRadius:11,background:active?C.success:C.gray300,position:"relative",flexShrink:0}}>
                          <div style={{position:"absolute",top:2,left:active?17:2,width:17,height:17,borderRadius:"50%",background:"white",transition:"left 0.15s"}}/>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AdminModal>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── APP ───
export default function App() {
  const { tg, tgUser, startParam, isDark, showBackButton, hideBackButton, haptic, safeTop, loginToBackend } = useTelegram();

  const [screen, setScreenRaw] = useState("home");
  const [prevScreen, setPrevScreen] = useState("home");

  // JWT token saqlash
  const [token, setToken] = useState(() => {
    try { return sessionStorage.getItem('auth_token') || null; } catch { return null; }
  });

  // Telegram foydalanuvchi avtomatik login
  const defaultUser = tgUser
    ? {
        name: tgUser.first_name || "Foydalanuvchi",
        surname: tgUser.last_name || "",
        phone: "",
        tgId: tgUser.id,
        username: tgUser.username || "",
        photo: tgUser.photo_url || null,
        isPro: false,
        isAdmin: ADMINS.some(a=>String(a.tgId)===String(tgUser.id)),
        adminRole: ADMINS.find(a=>String(a.tgId)===String(tgUser.id))?.role || null,
      }
    : { name: "Alisher", surname: "Karimov", phone: "+998 90 123 45 67", isPro: false, isAdmin: true, adminRole: "super" };

  const [user, setUser] = useState(defaultUser);

  // Backenddan kelgan ma'lumotlar (tickets/topics/rules/...) yuklanganini
  // bildirish uchun versiya raqami — o'zgarganda komponentlar qayta render bo'ladi
  const [dataVersion, setDataVersion] = useState(0);
  const bumpDataVersion = () => setDataVersion(v => v + 1);

  // Backend login — ilova ochilganda
  useEffect(() => {
    if (!loginToBackend) return;
    loginToBackend().then(async res => {
      if (!res) return;
      try { sessionStorage.setItem('auth_token', res.token); } catch {}
      setToken(res.token);
      if (res.user) {
        setUser(prev => ({
          ...prev,
          id: res.user.id,
          tgId: res.user.tgId,
          name: res.user.firstName || prev.name,
          surname: res.user.lastName || prev.surname,
          username: res.user.username || prev.username,
          isPro: res.user.isPro || false,
          proExpiresAt: res.user.proExpiresAt,
          referralCode: res.user.referralCode,
          isAdmin: !!res.user.isAdmin,
          adminRole: res.user.adminRole || null,
          adminPerms: res.user.adminPerms || null,
        }));
      }
      // Backend dan umumiy sozlamalarni olamiz (limits/discount/prices/referral_milestones)
      if (res.settings) {
        if (res.settings.limits) Object.assign(LIMITS, res.settings.limits);
        if (res.settings.discount) Object.assign(DISCOUNT, res.settings.discount);
        if (res.settings.prices) Object.assign(PRICES, res.settings.prices);
        if (Array.isArray(res.settings.referral_milestones)) {
          REFERRAL_CONFIG.milestones = res.settings.referral_milestones;
        }
      }
      // Biletlar/mavzular/qoidalarni bitta so'rovda yuklaymiz
      const loaded = await loadContentBundle(res.token);
      if (loaded) bumpDataVersion();
    }).catch(err => console.warn('Backend login failed, using offline mode:', err));
  }, [tgUser?.id]);

  // Duel taklif havolasi orqali ochilgan bo'lsa — duelga avtomatik qo'shilish
  useEffect(() => {
    if (!token || !startParam) return;
    if (!startParam.startsWith("duel_")) return;
    const duelId = startParam.slice(5);
    apiPost(`/duel/${duelId}/join`, {}, token)
      .then(() => setScreen("duel"))
      .catch(err => console.warn("Duelga qo'shilmadi:", err));
  }, [token, startParam]);

  // Onboardingni faqat birinchi marta ko'rsatish
  // localStorage ishlatish mumkin emas (Telegram Mini App da cheklov bor)
  // Shuning uchun sessionStorage ishlatamiz
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try { return !sessionStorage.getItem("ob_done"); } catch { return true; }
  });

  const [activeTicket, setActiveTicket] = useState(null);
  const [activeDuel, setActiveDuel] = useState(null);
  const [duelResult, setDuelResult] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [lastTestResult, setLastTestResult] = useState(null);
  const [examResult, setExamResult] = useState(null);

  // Telegram mavzusiga mos holda dark mode
  const [dark, setDark] = useState(isDark);

  // dark o'zgarganda Telegram header va background rangini yangilash
  useEffect(() => {
    if (!tg) return;
    try { tg.setHeaderColor(dark ? "#1E3A5F" : "#1A6BFF"); } catch {}
    try { tg.setBackgroundColor(dark ? "#0F172A" : "#F8FAFC"); } catch {}
  }, [dark]);
  const [lang, setLang] = useState("uz");
  const [notifs, setNotifs] = useState(INIT_NOTIFS);
  const [notifSettings, setNotifSettings] = useState({ daily: true, result: true, new: true, exam: true });
  const [toasts, setToasts] = useState([]);
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [showLangModal, setShowLangModal] = useState(false);

  // Ekran o'zgarganda Telegram Back button boshqaruvi
  const setScreen = (s) => {
    setPrevScreen(screen);
    setScreenRaw(s);
  };

  // Qaysi ekranlarda Telegram Back button ko'rsatiladi
  const rootScreens = ["home", "tickets", "tests", "exam", "stats", "profile", "duel", "referral"];

  useEffect(() => {
    if (rootScreens.includes(screen)) {
      hideBackButton();
    } else {
      showBackButton(() => {
        // Telegram back button bosilganda oldingi ekranga qaytish
        if (screen === "ticket-quiz") setScreen("tickets");
        else if (screen === "test-quiz") setScreen("tests");
        else if (screen === "exam-quiz") setScreen("exam");
        else if (screen === "duel-quiz" || screen === "duel-result") setScreen("duel");
        else if (screen === "ticket-result") setScreen("tickets");
        else if (screen === "exam-result" || screen === "exam-fail") setScreen("exam");
        else if (screen === "test-result") setScreen("tests");
        else if (screen === "pro") setScreen("profile");
        else if (screen === "notifications") setScreen("home");
        else if (screen === "saved") setScreen(prevScreen || "profile");
        else if (screen === "search") setScreen("home");
        else if (screen === "topics") setScreen("home");
        else if (screen === "rules") setScreen("home");
        else if (screen === "rating") setScreen("stats");
        else setScreen("home");
      });
    }
  }, [screen]);

  const T = LANGS[lang];
  const C = getTheme(dark);
  const noNav = ["ticket-quiz", "test-quiz", "exam-quiz", "duel-quiz", "duel-result", "notifications", "saved", "search", "pro"];
  const showNav = !noNav.includes(screen);

  const unreadCount = notifs.filter(n => !n.read).length;

  // Pro obunani faollashtirish (admin tasdiqlagandan keyin)
  const grantPro = (days, customMsg) => {
    const expires = new Date(Date.now() + (days||30) * 86400000).toISOString();
    setUser(prev => ({ ...prev, pro: true, isPro: true, proExpiresAt: expires }));
    const approvedMsg = customMsg || {
      uz:"🎉 Pro obuna faollashtirildi! Endi barcha imkoniyatlar ochiq.",
      ru:"🎉 Pro подписка активирована! Все возможности открыты.",
      kril:"🎉 Pro обуна фаоллаштирилди! Энди барча имкониятлар очиқ.",
    };
    setNotifs(p=>[{ id:Date.now(), type:"result", read:false, time:0, titleKey:"notifResult", body:approvedMsg }, ...p]);
    addToast(approvedMsg.uz, "success");
  };

  const addToast = (msg, type = "info") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
    // Telegram haptic feedback
    if (type === "success") haptic.success();
    else if (type === "error") haptic.error();
    else haptic.light();
  };

  // Onboarding tugaganda sessionStorage ga yozish
  const finishOnboarding = () => {
    try { sessionStorage.setItem("ob_done", "1"); } catch {}
    setShowOnboarding(false);
  };

  // Simulate incoming notification every 30s
  useEffect(() => {
    if (!user) return;
    const t = setInterval(() => {
      const msgs = {
        uz: "Yangi bildirishnoma keldi!",
        ru: "Новое уведомление!",
        kril: "Янги билдиришнома келди!",
      };
      setNotifs(p => [{ id: Date.now(), type: "daily", read: false, time: 0, titleKey: "notifDaily", body: { uz: msgs.uz, ru: msgs.ru, kril: msgs.kril } }, ...p]);
      addToast(msgs[lang], "info");
    }, 30000);
    return () => clearInterval(t);
  }, [user, lang]);

  const handleExamResult = (result) => {
    setExamResult(result);
    const msg = {
      uz: result.passed ? "Imtihondan o'tdingiz! 🎉" : "Imtihondan o'ta olmadingiz",
      ru: result.passed ? "Экзамен сдан! 🎉" : "Экзамен не сдан",
      kril: result.passed ? "Имтиҳондан ўтдингиз! 🎉" : "Имтиҳондан ўта олмадингиз",
    };
    addToast(msg[lang], result.passed ? "success" : "error");
    if (notifSettings.result) {
      setNotifs(p => [{ id: Date.now(), type: "result", read: false, time: 0, titleKey: "notifResult", body: msg }, ...p]);
    }
  };

  const props = { T, C, dark, setDark, lang, setLang, notifs, setNotifs, notifSettings, setNotifSettings, unreadCount, addToast, savedQuestions, setSavedQuestions, setShowLangModal, grantPro, setScreen, token };

  const render = () => {
    switch (screen) {
      case "home": return <HomeScreen {...props} setScreen={setScreen} user={user} />;
      case "tickets": return <TicketsScreen {...props} setScreen={setScreen} setActiveTicket={setActiveTicket} user={user} />;
      case "ticket-quiz": return <TicketQuizScreen {...props} setScreen={setScreen} ticket={activeTicket} setLastResult={setLastResult} />;
      case "ticket-pro-gate": return <ProGate T={T} C={C} setScreen={setScreen} reason="ticket" onBack={()=>setScreen("tickets")}/>;
      case "ticket-result": return <TicketResultScreen {...props} setScreen={setScreen} result={lastResult} />;
      case "tests": return <TestsScreen {...props} setScreen={setScreen} user={user} />;
      case "test-quiz": return <TestQuizScreen {...props} setScreen={setScreen} setLastTestResult={setLastTestResult} user={user} />;
      case "test-result": return <ExamResultScreen {...props} setScreen={setScreen} result={lastTestResult ?? { correct: 9, total: 12, wrong: 3, passed: true, percent: 75 }} />;
      case "exam": return <ExamScreen {...props} setScreen={setScreen} user={user} />;
      case "exam-quiz": return <ExamQuizScreen {...props} setScreen={setScreen} setExamResult={handleExamResult} user={user} />;
      case "exam-result": return <ExamResultScreen {...props} setScreen={setScreen} result={examResult ?? { correct: 19, total: 20, wrong: 1, passed: true, percent: 95 }} />;
      case "exam-fail": return <ExamResultScreen {...props} setScreen={setScreen} result={examResult ?? { correct: 16, total: 20, wrong: 4, passed: false, percent: 80 }} />;
      case "stats": return <StatsScreen {...props} />;
      case "rating": return <RatingScreen {...props} />;
      case "profile": return <ProfileScreen {...props} setScreen={setScreen} user={user} setUser={setUser} tgUser={tgUser} />;
      case "pro": return <ProScreen {...props} setScreen={setScreen} user={user} token={token} bumpDataVersion={bumpDataVersion}/>;
      case "duel": return <DuelScreen {...props} setScreen={setScreen} user={user} addToast={addToast} setActiveDuel={setActiveDuel}/>;
      case "duel-quiz": return <DuelQuizScreen {...props} setScreen={setScreen} duelId={activeDuel} setDuelResult={setDuelResult} addToast={addToast}/>;
      case "duel-result": return <DuelResultScreen T={T} C={C} setScreen={setScreen} duelResult={duelResult}/>;
      case "admin": return <AdminScreen T={T} C={C} setScreen={setScreen} user={user} lang={lang} notifs={notifs} setNotifs={setNotifs} addToast={addToast} grantPro={grantPro} token={token} bumpDataVersion={bumpDataVersion}/>;
      case "referral": return <ReferralScreen T={T} C={C} setScreen={setScreen} user={user} addToast={addToast} token={token}/>;
      case "about": return <AboutScreen T={T} C={C} setScreen={setScreen} lang={lang}/>;
      case "topics": return <TopicsScreen {...props} setScreen={setScreen} />;
      case "rules": return <RulesScreen {...props} setScreen={setScreen} />;
      case "notifications": return <NotificationsScreen {...props} setScreen={setScreen} />;
      case "saved": return <SavedQuestionsScreen {...props} setScreen={setScreen} setActiveTicket={setActiveTicket} prevScreen={prevScreen} />;
      case "search": return <SearchScreen {...props} setScreen={setScreen} setActiveTicket={setActiveTicket} />;
      default: return <HomeScreen {...props} setScreen={setScreen} user={user} />;
    }
  };

  // Telegram Mini App da wrapper kengligi 100% bo'lishi kerak (telefon ekrani)
  // safeTop — Telegram status bar balandligi (notch uchun)
  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      // Telegram safe area — status bar va pastki navigatsiya uchun joy qoldirish
      paddingTop: safeTop,
    }}>
      <style>{`
        @keyframes slideDown { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        body { margin: 0; padding: 0; overflow-x: hidden; }
        input, button { font-family: 'DM Sans','Segoe UI',sans-serif; }
      `}</style>

      <LangModal visible={showLangModal} onClose={() => setShowLangModal(false)} lang={lang} setLang={setLang} C={C} />

      {showOnboarding ? (
        <OnboardingScreen onFinish={finishOnboarding} T={T} C={C} lang={lang} setLang={setLang} />
      ) : (
        <PhoneWrapper {...props} showNav={showNav} screen={screen} setScreen={setScreen}>
          <Toast toasts={toasts} />
          <div style={{ overflowY: "auto", height: showNav ? "calc(100vh - 70px)" : "100vh" }}>
            {render()}
          </div>
        </PhoneWrapper>
      )}
    </div>
  );
}
