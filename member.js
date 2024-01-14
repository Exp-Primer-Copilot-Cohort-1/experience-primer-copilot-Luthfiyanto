function skillsMember() {
  var skill = document.getElementById("skills");
  var skillValue = skill.options[skill.selectedIndex].value;
  var skillText = skill.options[skill.selectedIndex].text;
  var skillList = document.getElementById("skillList");
  var skillListValue = skillList.value;
  var skillListText = skillList.text;
  if (skillListValue == "") {
    skillList.value = skillValue;
    skillList.text = skillText;
  } else {
    skillList.value = skillListValue + "," + skillValue;
    skillList.text = skillListText + "," + skillText;
  }
}
