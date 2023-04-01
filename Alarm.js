//ALL fetched Elements 
const hour_select = document.getElementById('hour_select');
const minute_select = document.getElementById('minute_select');
const second_select = document.getElementById('second_select');
const amPM_select = document.getElementById('AM_PM');
const clock_hr = document.getElementById('hr');
const clock_min = document.getElementById('min');
const clock_sec = document.getElementById('sec');
const clock_amPM = document.getElementById('clock_AM_PM');
const select_time = document.getElementById('Alarm_time');
const set_Alarm_btn = document.getElementById('set');
const cancel_Alarm_btn = document.getElementById('cancel');
const Ul_List = document.getElementById('list');
const Switch_Access = document.getElementById('Switch_Access');
let Times_For_Alarm_Ringing = [];
let Time_List_Array = [];
var SELECTED_HOUR = '0' + 1;
var SELECTED_MINUTE = '0' + 0;
var SELECTED_SECOND = '0' + 0;
var SELECTED_AMPM = 'AM';
var Timeobj;
var audio = new Audio('https://www.freespecialeffects.co.uk/soundfx/animals/duck1.wav');
audio.loop = true;
// IIEF FOR SET DROPDOWN MENU VALUES ON PAGE LOAD 
(function setDropdownValues() {
    for (let hr = 1; hr <= 12; hr++) {
        const option_hr = document.createElement('option');
        option_hr.setAttribute('value', hr < 10 ? '0' + hr : hr);
        option_hr.innerText = hr < 10 ? '0' + hr : hr;
        hour_select.append(option_hr);
    }
    for (let min = 00; min <= 59; min++) {
        const option_min = document.createElement('option');
        option_min.setAttribute('value', min < 10 ? '0' + min : min);
        option_min.innerText = min < 10 ? '0' + min : min;
        minute_select.append(option_min);
    }
    for (let sec = 0; sec <= 59; sec++) {
        const option_sec = document.createElement('option');
        option_sec.setAttribute('value', sec < 10 ? '0' + sec : sec);
        option_sec.innerText = sec < 10 ? '0' + sec : sec;
        second_select.append(option_sec);
    }
})();
// 12 hour clock
function updateClock() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    // Add zeros to minutes and seconds and hours
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    var amPM = hours < 12 ? 'AM' : 'PM';
    // Convert to 12-hour format
    if (hours > 12) {
        hours -= 12;
    }
    if (hours == 00) {
        hours = 12;
    }
    if (hours < 10) {
        hours = '0' + hours;
    }
    // Update clock element with new time
    clock_hr.innerText = hours;
    clock_min.innerText = minutes;
    clock_sec.innerText = seconds;
    clock_amPM.innerText = amPM;
    // ringing alarm on given time
    for (let Time of Times_For_Alarm_Ringing) {
        if (Time.HR__FOR_OBJ == clock_hr.innerText && Time.MIN_FOR_OBJ == clock_min.innerText && Time.SEC_FOR_OBJ == clock_sec.innerText && Time.AMPM_FOR_OBJ == clock_amPM.innerText) {
            audio.pause();
            audio.play();
            setTimeout(() => {
                showNotification(`Alarm ringing for ${Time.HR__FOR_OBJ}:${Time.MIN_FOR_OBJ}:${Time.SEC_FOR_OBJ}:${Time.AMPM_FOR_OBJ} Time`);
            }, 1000);
        }
    }

}
// delete items from list
function deleteTime(TimeID) {
    const newList = Time_List_Array.filter((Time) => { return Time.id != TimeID })
    showNotification('Time Deleted successfully');
    Time_List_Array = newList;
    Times_For_Alarm_Ringing = newList;
    audio.pause();
    renderList();
}
// show notification
function showNotification(msg) {
    alert(msg);
}
function takeInputFromDropDown() {
    // take values from dropdown
    SELECTED_HOUR = hour_select.value;
    SELECTED_MINUTE = minute_select.value;
    SELECTED_SECOND = second_select.value;
    SELECTED_AMPM = amPM_select.value;
    return;
}
function addTimeToDOM(Time) {
    const li = document.createElement('li');
    li.innerHTML = `
    <div id="Time_list">
        <span id="Time_in_list">${Time.HR__FOR_OBJ}:${Time.MIN_FOR_OBJ}:${Time.SEC_FOR_OBJ}${Time.AMPM_FOR_OBJ}</span>
    </div>
    <label class="switch">
        <input type="checkbox" id="Switch_Access" class="SWITCH"  data-id="${Time.id}" ${Time.TOGGLE_STATUS === true ? 'checked' : ''}>
        <span class="slider round"></span>
    </label>
    <img src="https://cdn-icons-png.flaticon.com/512/3687/3687412.png" class="delete" data-id="${Time.id}" alt="...img">`;
    const hr = document.createElement('hr');
    hr.style.marginTop = "-2px";
    hr.style.marginBottom = "2px";
    Ul_List.append(hr);
    Ul_List.append(li);
}
// render set time list in display
function renderList() {
    Ul_List.innerText = '';
    for (let i = 0; i < Time_List_Array.length; i++) {
        addTimeToDOM(Time_List_Array[i]);
    }
}
function SetAlarm() {
    SELECTED_HOUR = hour_select.value;
    SELECTED_MINUTE = minute_select.value;
    SELECTED_SECOND = second_select.value;
    SELECTED_AMPM = amPM_select.value;
    // Check if selected time already exists in the list
    const existingTime = Time_List_Array.find(time => time.HR__FOR_OBJ === SELECTED_HOUR && time.MIN_FOR_OBJ === SELECTED_MINUTE && time.SEC_FOR_OBJ === SELECTED_SECOND && time.AMPM_FOR_OBJ === SELECTED_AMPM);
    if (existingTime) {
        showNotification('This time is already set as an alarm');
        return;
    }
    // Create object 
    Timeobj = { HR__FOR_OBJ: SELECTED_HOUR, MIN_FOR_OBJ: SELECTED_MINUTE, SEC_FOR_OBJ: SELECTED_SECOND, AMPM_FOR_OBJ: SELECTED_AMPM, id: Date.now(), TOGGLE_STATUS: true };
    Time_List_Array.push(Timeobj);
    Times_For_Alarm_Ringing.push(Timeobj);
    renderList();
}
var Toggled_Times_false = [];
var Toggled_Times_True = [];
// toggle Time in display 
function toggleTime(TimeID, Toggled_Obj) {
    if (Toggled_Obj.TOGGLE_STATUS === true) {

        Toggled_Obj.TOGGLE_STATUS = false;

        let newFalse = Times_For_Alarm_Ringing.filter((Time) => { return Time.id == TimeID });
        // check if newFalse[0] already exists in Toggled_Times_false before pushing it

        if (!Toggled_Times_false.includes(newFalse[0])) {

            Toggled_Times_false.push(newFalse[0]);
        }

        let oldRingng_Time_Update = Times_For_Alarm_Ringing.filter((Time) => { return Time.id != TimeID })

        Times_For_Alarm_Ringing = oldRingng_Time_Update;
        for (let False of Toggled_Times_false) {
            False.TOGGLE_STATUS=false;
        }
        console.log('Times_For_Alarm_Ringing', Times_For_Alarm_Ringing);
        console.log('Toggled_Times_true',Toggled_Times_True);
        console.log('Toggled_Times_false', Toggled_Times_false);

        return;
    }
    if (Toggled_Obj.TOGGLE_STATUS === false) {
        Timeobj.TOGGLE_STATUS = true;
        // filter Toggled_Times_false instead of Time_List_Array to get the correct object

        Toggled_Times_True = Toggled_Times_false.filter((Time) => { return Time.id == TimeID });
        Toggled_Times_false=Toggled_Times_false.filter((Time)=>{return Time.id!=TimeID})
        for (let True of Toggled_Times_True) {
            True.TOGGLE_STATUS=true;
        }
        console.log('Toggled Time True', Toggled_Times_True);
        console.log('Toggled Time False', Toggled_Times_false);
        // check if Toggled_Times_True[0] already exists in Times_For_Alarm_Ringing before pushing it
        if (!Times_For_Alarm_Ringing.includes(Toggled_Times_True[0])) {
            Times_For_Alarm_Ringing.push(Toggled_Times_True[0]);
        }
        console.log('Time for AlarmTiming', Times_For_Alarm_Ringing);
        return;
    }
}
function handleDeletion(event) {
    const target = event.target;
    if (target.className === 'delete') {
        const TimeID = target.dataset.id;
        deleteTime(TimeID);
    }
    if (target.className === 'SWITCH') {
        console.log('Switch Toggled');
        const TimeID = target.dataset.id;
        for (let Toggled_Obj of Time_List_Array) {
            if (Toggled_Obj.id == TimeID) {
                console.log(Toggled_Obj);
                toggleTime(TimeID, Toggled_Obj);
            }
        }
    }
}
// Update clock every second
function initializeAlarm() {
    setInterval(updateClock, 1000);
    document.addEventListener('click', handleDeletion);
    set_Alarm_btn.addEventListener('click', SetAlarm);
    select_time.addEventListener('change', takeInputFromDropDown);
}
initializeAlarm();
