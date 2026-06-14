export default function SubmitButton({
  classStyle,
  disabled,
  onChange,
  onClick,
}) {
  return (
    <div>
      <div>
        <button
          type="submit"
          onClick={onClick}
          onChange={onChange}
          disabled={disabled}
          className={`relative px-30 py-2 font-semibold w-[300px] text-white text-[20px] rounded-[10px] cursor-pointer overflow-hidden group ${classStyle}`}
        >
          <span className="absolute inset-0  bg-[gold]  transition-transform duration-500 transform group-hover:scale-150 group-hover:rotate-180 z-0"></span>
          <span className="relative z-10 text-[black] "> ثبت رزومه </span>
        </button>
      </div>
    </div>
  );
}
