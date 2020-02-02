# countdown

## Example use:
HTML
```html
<div class="counter"></div>
```

JS
```js
var countdown = new Countdown(".counter", {
   date: "14.1.2020 7:00",
   template: "Pozostało: {D} Dni, {H} Godzin, {M} minut i {S} sekund",
   endText: "Odliczanie zakończone",
   addZero: true,
   serverTime: "13.1.2020 7:00"
})
```

## Date format:
DD.MM.YYY HH:MM:SS or DD.MM.YYY HH:MM

## Options:

| Option     | Description                                                                | Default                                        |
|------------|----------------------------------------------------------------------------|------------------------------------------------|
| date       | Countdown end date. (Required!)                                            |                                                |
| template   | Display template                                                           | {D} Days, {H} Hours, {M} Minutes, {S} Seconds" |
| endText    | The text displayed when the countdown comes to an end                      | null                                           |
| addZero    | Is added at the zero numbers less than zero, except for the number of days | false                                          |
| serverTime | Time from the server in the same format as the end time countdown          | null                                           |
# test
