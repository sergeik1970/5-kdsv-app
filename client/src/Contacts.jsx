import "./Contacts.css"
function Contacts() {
    return (
      <div className="contacts_container">
        <h2>Контакты</h2>
        <p>Если у вас есть вопросы, предложения или вы хотите с нами связаться — напишите нам.</p>
  
        <div className="contact-info">
          <p><strong>Telegram:</strong> <a href="https://t.me/sergey_kdsv">@sergey_kdsv</a></p>
          <p><strong>Сайт:</strong> <a href="https://kdsv.ru/">kdsv.ru</a></p>
          <p><strong>Эл почта:</strong> <a href="mailto:sergey.m.kudashev@gmail.com">Написать обращение...</a></p>
        </div>
      </div>
    );
  }
  
  export default Contacts;