import './Chatbot.less';

const AnswerFileImage = ({ onChange }) => {
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

export default AnswerFileImage;
