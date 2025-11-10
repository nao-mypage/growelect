const form = document.getElementById("contactForm");
const backBtn = document.getElementById("backBtn");
const overlay = document.getElementById("contact__overlay");
const submitBtn = document.getElementById("finalSubmit");
const result = document.getElementById("result-message");
const ACCESS_TOKEN = "t002";

form.addEventListener("submit", function(e){

    e.preventDefault();

    let valid = true;
    let errorElement = null;
    
    const name = this.name.value.trim();
    const company = this.company.value.trim();
    const email = this.email.value.trim();
    const phone = this.phone.value.trim();
    const message = this.message.value.trim();


    const errorElements = {
        name: document.getElementById("error-name"),
        company: document.getElementById("error-company"),
        email: document.getElementById("error-email"),
        phone: document.getElementById("error-phone"),
        message: document.getElementById("error-message"),
    };

    // エラーメッセージをリセット
    for (const key in errorElements) {
        errorElements[key].textContent = "";
    }

    // 入力チェック
    if(!message){
        errorElements.message.textContent = "お問い合わせ内容を入力してください。";
        errorElement = errorElements.message;
        valid = false;
    }
    else if(message.length > 1000){
        errorElements.message.textContent = "1000文字以内にしてください。";
        errorElement = errorElements.message;
        valid = false;
    }
    if (!phone) {
        errorElements.phone.textContent = "電話番号を入力してください。";
        errorElement = errorElements.phone;
        valid = true;
    }
    else if(!phone.match(/^0\d{1,4}-?\d{1,4}-?\d{3,4}$/) || phone.length > 20){
        errorElements.phone.textContent = "電話番号の形式が正しくありません（例：090-1234-5678）。";
        errorElement = errorElements.phone;
        valid = false;
    } 
    if (!email){
        errorElements.email.textContent = "メールアドレスを入力してください。";
        errorElement = errorElements.email;
        valid = true;
    }
    else if(email.length > 100){
        errorElements.email.textContent = "100文字以内にしてください。";
        errorElement = errorElements.email;
        valid = false;
    }
    else if(!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)){
        errorElements.email.textContent = "メールアドレスの形式が正しくありません。";
        errorElement = errorElements.email;
        valid = false;
    }        
    if(!name){
        errorElements.name.textContent = "お名前を入力してください。";
        errorElement = errorElements.name;
        valid = false;
    }
    else if(name.length > 50){
        errorElements.name.textContent = "50文字以内にしてください。";
        errorElement = errorElements.name;
        valid = false;
    }


    if(!valid) {
        if(errorElement){
            errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
    };

    // モーダルに内容を反映
    document.getElementById("confirm-name").textContent = name;
    document.getElementById("confirm-company").textContent = company || "（なし）";
    document.getElementById("confirm-email").textContent = email;
    document.getElementById("confirm-phone").textContent = phone;
    document.getElementById("confirm-message").textContent = message;

    // モーダル表示
    document.getElementById("contact__overlay").style.display = "flex";
});

// 最終確認 戻るボタン
backBtn.addEventListener("click", () => {
    overlay.style.display = "none";
});

// 最終確認 送信ボタン
submitBtn.addEventListener("click", async () => {

    // すぐに二度押しできないようにする
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.6";
    submitBtn.style.pointerEvents = "none";
    backBtn.style.pointerEvents = "none";

    result.textContent = "送信中です…";
    result.style.color = "#333";

    // const form = document.getElementById("contactForm");
    const data = Object.fromEntries(new FormData(form).entries());
    data.token = ACCESS_TOKEN;
    
    result.textContent = "送信中です…";
    try {
        const res = await fetch('https://script.google.com/macros/s/AKfycbxyd3dG1FomBR8N1sL8RbP618kO2EwJhnwNB-XC48suLcO6in6_uzGwmEo4OTIxjMmrtg/exec', {
            method: 'POST',
            // headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
        });

        const json = await res.json();

        if (json.result === 'success') {
            result.textContent = '送信が完了しました。';
            result.style.color = '#15b815';
            form.reset();
            
            submitBtn.style.display = "none"; // ボタンを非表示にする
            backBtn.textContent = "閉じる"; //  戻るボタンのテキストを「閉じる」に変更
        } else {
            result.textContent = '送信に失敗しました。ネットワーク環境をご確認の上、再度送信してください。';
            result.style.color = '#e60000';
        }

    } catch (err) {
        console.error(err);
        result.textContent = 'エラーが発生しました。';
        result.style.color = '#e60000';
    }

    // alert('aaa')


    // 処理終了後、再度ボタンを有効化
    submitBtn.disabled = false;
    submitBtn.style.opacity = "1";
    submitBtn.style.pointerEvents = "auto";
    backBtn.style.pointerEvents = "auto";
});

// 送信完了後 閉じるボタン（戻るボタン）
backBtn.addEventListener("click", () => {
    overlay.style.display = "none";
    result.textContent = "";
    submitBtn.style.display = "inline-block";
    backBtn.textContent = "戻る";
});

// 電話番号自動ハイフン挿入
document.addEventListener("DOMContentLoaded", () => {
    const phoneInput = document.getElementById("phone");

    // 市外局番と市内局番桁数のマップ（抜粋版）
    const TEL_MAP = {
        // 携帯・IP電話
        '050': 4, '070': 4, '080': 4, '090': 4,
        '020': 3, '0120': 3, '0800': 3, '0570': 3, '0990': 3,
        // 固定電話（一部主要都市 and 富山・新潟・石川・福井・岐阜・長野）
        '011': 3, '0123': 2, '0133': 2, '0154': 2, '017': 3,
        '018': 3, '019': 3, '022': 3, '023': 3, '024': 3,
        '025': 3, '0250': 2, '0254': 2, '0255': 2, '0256': 2, '0257': 2, '0258': 2, '0259': 2,
        '026': 3, '0260': 2, '0261': 2, '0263': 2, '0264': 2, '0265': 2, '0266': 2, '0267': 2, '0268': 2, '0269': 2, 
        '027': 3, '028': 3, '029': 3,
        '03': 4, '04': 4, '045': 3, '046': 3, '047': 3,
        '048': 3, '049': 3, 
        '052': 3, '053': 3, '054': 3, '055': 3, 
        '0572': 2, '0573': 2, '0574': 2, '0575': 2, '0576': 2, '05769': 1, '0577': 2, '0578': 2,
        '058': 3, '0581': 2, '0584': 2, '0585': 2, 
        '059': 3, '06': 4, 
        '072': 3, '073': 3, '075': 3, '076': 3, '0761': 2,'0763': 2, 
        '0765': 2, '0766': 2, '0767': 2, '0768': 2, 
        '077': 3, '0770': 2, '0776': 2, '0778': 2,  '0779': 2,
        '078': 3,
        '079': 3, '082': 3, '083': 3, '084': 3, '085': 3,
        '086': 3, '087': 3, '088': 3, '089': 3, '092': 3,
        '093': 3, '094': 3, '095': 3, '096': 3, '097': 3,
        '098': 3, '099': 3
    };

    // 桁数別にグループ化
    const TEL_MAP_BY_LEN = {};
    for (let [k, v] of Object.entries(TEL_MAP)) {
        const len = k.length;
        TEL_MAP_BY_LEN[len] ??= {};
        TEL_MAP_BY_LEN[len][k] = v;
    }

    // 実際のフォーマット関数
    function formatPhoneNumber(num) {
        num = num.replace(/[^\d]/g, ''); // 数字以外削除

        // 5〜2桁の市外局番候補を長い順に探索
        for (let len = 5; len >= 2; len--) {
        const prefix = num.slice(0, len);
        if (TEL_MAP_BY_LEN[len] && TEL_MAP_BY_LEN[len][prefix]) {
            const innerLen = TEL_MAP_BY_LEN[len][prefix];
            const area = prefix;
            const city = num.slice(len, len + innerLen);
            const subscriber = num.slice(len + innerLen);
            return [area, city, subscriber].filter(Boolean).join('-');
        }
        }

        // 該当なし → とりあえず3-4-4形式に強制
        if (num.length <= 3) return num;
        if (num.length <= 7) return num.slice(0, 3) + '-' + num.slice(3);
        return num.slice(0, 3) + '-' + num.slice(3, 7) + '-' + num.slice(7, 11);
    }

    // 入力中に自動でフォーマット
    phoneInput.addEventListener("input", (e) => {
        const cursorPos = e.target.selectionStart;
        const before = e.target.value;
        e.target.value = formatPhoneNumber(e.target.value);
        const diff = e.target.value.length - before.length;
        e.target.setSelectionRange(cursorPos + diff, cursorPos + diff);
    });
});