var token = "Substitua pelo seu token"; // Substitua pelo seu token
var id = "Substitua pelo seu ID do chat"; // Substitua pelo seu ID do chat
var ssId = "Substitua pelo ID da sua planilha"; // Substitua pelo ID da sua planilha
var sheetName = "teste"; // Substitua pelo nome da sua aba

function sendMessage(id, text) {
  var data = {
    method: "post",
    payload: {
      method: "sendMessage",
      chat_id: String(id),
      text: text,
      parse_mode: "HTML",
    }
  };

  var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/', data);
  var content = response.getContentText();
  var json = JSON.parse(content);
  if (!json.ok) {
    Logger.log("Erro ao enviar mensagem para o Telegram: " + json.description);
  }
}

function onEdit(e) {
  if (!e || !e.range) return;

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (sheet.getSheetId() !== e.range.getSheet().getSheetId()) return; // Verifica se a edição ocorreu na aba correta

  var editedRow = e.range.getRow();
  var editedColumn = e.range.getColumn();
  var editedValue = e.value; // Obtém o novo valor inserido

  // Verifica se a edição ocorreu na coluna "E" (coluna 5) e se há um valor inserido
  if (editedColumn === 5 && editedValue) {
    var rowValues = sheet.getRange(editedRow, 1, 1, sheet.getLastColumn()).getValues()[0];
    var message = "Nova informação inserida na Coluna E (Linha " + editedRow + "):\n";
    for (var i = 0; i < rowValues.length; i++) {
      message += "Coluna " + (i + 1) + ": " + rowValues[i] + "\n";
    }
    sendMessage(id, message);
  }
}

function setupTrigger() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ScriptApp.newTrigger('onEdit') // Usar o gatilho onEdit
      .forSpreadsheet(ss)
      .onEdit()
      .create();
}

function deleteTrigger() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'onEdit') {
      ScriptApp.deleteTrigger(triggers[i]);
      return;
    }
  }
}

// Instruções:
// 1. Substitua SEU_TOKEN_DO_TELEGRAM e SEU_ID_DO_CHAT pelas suas informações.
// 2. Substitua SEU_ID_DA_PLANILHA e o nome da aba se forem diferentes (já feito no seu código).
// 3. Execute a função deleteTimeDrivenTrigger() para remover o gatilho baseado em tempo anterior.
// 4. Execute a função setupTrigger() UMA VEZ para criar o gatilho "Ao editar".
// 5. Agora, sempre que você inserir ou modificar um valor na coluna "E", uma mensagem será enviada para o Telegram.
// 6. Para remover o gatilho "Ao editar", execute a função deleteTrigger().
