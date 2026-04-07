export default function LegendItem({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <div className='flex items-center gap-3 text-sm text-gray-600 font-poppins '>
      <span
        className='w-3 h-3 rounded-full'
        style={color ? { backgroundColor: color } : undefined}
      />
      <span>{label}</span>
    </div>
  );
}
