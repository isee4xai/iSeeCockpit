import './Chatbot.less';


const AnswerFile = ({ onChange }) => {
  return (
    <div>
      <input
        placeholder="Select file"
        type="file"
        accept="image/png, image/jpeg"
        onChange={onChange}
      />
    </div>
  );
};

export default AnswerFile;
