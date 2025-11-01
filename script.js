document.addEventListener("DOMContentLoaded", () => {
  const clock = document.getElementById("clock");
  const toggleBtn = document.getElementById("toggleSeconds");
  let showSeconds = true;

  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");
    clock.textContent = showSeconds ? `${h}:${m}:${s}` : `${h}:${m}`;
  }

  toggleBtn.addEventListener("click", () => {
    showSeconds = !showSeconds;
    updateClock();
  });

  updateClock();
  setInterval(updateClock, 1000);
});
// アラーム関連要素
const alarmArea = document.getElementById('alarmArea');
const alarmTimeInput = document.getElementById('alarmTime');
const alarmSetBtn = document.getElementById('alarmSetBtn');
const alarmsContainer = document.getElementById('alarmsContainer');

let alarms = JSON.parse(localStorage.getItem('nclock_alarms') || '[]'); // {id,hour,min,enabled}

// アラームID生成
function genId(){ return Math.floor(Math.random()*1e9).toString(36); }

// アラーム表示更新
function renderAlarms(){
  alarmsContainer.innerHTML = '';
  if(alarms.length === 0){
    alarmsContainer.innerHTML = `<div style="color:var(--muted);padding:8px">${lang==='en' ? 'No alarms' : 'アラームなし'}</div>`;
    return;
  }
  alarms.forEach((a, idx) => {
    const card = document.createElement('div');
    card.className = 'alarm-card';
    card.style.display = 'flex';
    card.style.justifyContent = 'space-between';
    card.style.alignItems = 'center';
    card.style.marginBottom = '8px';
    card.style.padding = '8px';
    card.style.border = '1px solid #ccc';
    card.style.borderRadius = '8px';

    // 時刻表示
    const timeDiv = document.createElement('div');
    timeDiv.textContent = `${String(a.hour).padStart(2,'0')}:${String(a.min).padStart(2,'0')}`;
    timeDiv.style.fontWeight = '500';

    // トグルスイッチ
    const toggle = document.createElement('label');
    toggle.className = 'switch';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = a.enabled;
    input.addEventListener('change', ()=>{
      a.enabled = input.checked;
      saveAll();
    });
    const slider = document.createElement('span');
    slider.className = 'slider';
    toggle.appendChild(input);
    toggle.appendChild(slider);

    // 削除ボタン
    const del = document.createElement('button');
    del.textContent = lang==='en' ? 'Delete' : '削除';
    del.style.marginLeft = '8px';
    del.addEventListener('click', ()=>{
      alarms.splice(idx,1);
      saveAll();
      renderAlarms();
    });

    const rightDiv = document.createElement('div');
    rightDiv.style.display = 'flex';
    rightDiv.appendChild(toggle);
    rightDiv.appendChild(del);

    card.appendChild(timeDiv);
    card.appendChild(rightDiv);
    alarmsContainer.appendChild(card);
  });
}

// アラーム追加
alarmSetBtn.addEventListener('click', ()=>{
  const val = alarmTimeInput.value;
  if(!val){ alert(lang==='en'?'Please pick a time':'時刻を選択してください'); return; }
  const [hh, mm] = val.split(':').map(n=>Number(n));
  if(isNaN(hh)||isNaN(mm)){ alert(lang==='en'?'Invalid time':'不正な時刻です'); return; }
  alarms.push({id:genId(), hour:hh, min:mm, enabled:true});
  saveAll();
  renderAlarms();
  alarmTimeInput.value='';
});

renderAlarms();

// アラーム通知
function checkAlarms(){
  const now = new Date();
  const keyNow = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}`;
  if(now.getSeconds() === 0){
    alarms.forEach(a=>{
      if(!a.enabled) return;
      if(a.hour === now.getHours() && a.min === now.getMinutes()){
        if(lastTriggered !== keyNow){
          lastTriggered = keyNow;
          saveAll();
          playAlarmSound();
          alert(lang==='en'?`Alarm: ${a.hour}:${a.min}`:`アラーム: ${a.hour}:${a.min}`);
        }
      }
    });
  }
}
