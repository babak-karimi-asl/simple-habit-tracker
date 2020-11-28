function _toTwoDigits(n) {
  return n > 9 ? n : "0" + n;
}

const _clone = (a) => JSON.parse(JSON.stringify(a));

export function getDate(dateString = null, addDay = null) {
  let date = null;
  if (dateString) date = new Date(dateString);
  else date = new Date();
  if (addDay) date.setDate(date.getDate() + addDay);
  return (
    date.getFullYear() +
    "-" +
    _toTwoDigits(parseInt(date.getMonth()) + 1) +
    "-" +
    _toTwoDigits(date.getDate())
  );
}

export function writeValue(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function readValue(key, defaultValue = null) {
  let result = localStorage.getItem(key);
  if (!result) {
    if (defaultValue) {
      writeValue(key, defaultValue);
      return _clone(defaultValue);
    } else return null;
  } else return JSON.parse(result);
}
