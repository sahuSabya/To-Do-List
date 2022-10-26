
// console.log(module);

module.exports.getDate = getDate;

function getDate(){
  let options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric' ,
  };
  let today = new Date();
  let day = today.toLocaleDateString("en-US", options);
  return day;
}
