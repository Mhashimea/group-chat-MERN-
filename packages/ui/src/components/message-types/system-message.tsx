interface SystemMessageProps {
  message: any;
}

function SystemMessage({ message = {} }: SystemMessageProps) {
  return (
    <div className="flex items-center justify-center my-3">
      <p className="bg-gray-200 px-4 rounded-full py-0.5 text-sm text-gray-800">
        {message.message}
      </p>
    </div>
  );
}

export default SystemMessage;
