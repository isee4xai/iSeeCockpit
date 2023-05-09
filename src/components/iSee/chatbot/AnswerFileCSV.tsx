import './Chatbot.less';


const AnswerFileCSV = ({ onChange }) => {
  return (
    <div>
      <input
        placeholder="Select file"
        type="file"
        accept=".csv"
        onChange={onChange}
      />
    </div>
  );
};

export default AnswerFileCSV;
