export type Lesson = {
  id: string;
  index: number;
  title: string;
  duration: string;
  hue: number;
};

export type TranscriptItem = {
  time: string;
  text: string;
  removed?: boolean;
  range?: string;
  reason?: string;
};

export const sourceVideo = {
  title: "Chữa bài: Tính bằng cách thuận tiện",
  duration: "45:32",
  date: "18/08/2026",
  source: "Zoom",
};

export const initialLessons: Lesson[] = [
  {
    id: "l1",
    index: 1,
    title: "Chữa bài toán bằng cách thuận tiện – Ý A",
    duration: "10:24",
    hue: 220,
  },
  {
    id: "l2",
    index: 2,
    title: "Chữa bài toán bằng cách thuận tiện – Ý B",
    duration: "09:12",
    hue: 260,
  },
  { id: "l3", index: 3, title: "Tổng kết và lưu ý", duration: "08:40", hue: 160 },
];

export const removedBreakdown = [
  { label: "Khoảng lặng", value: "08:21" },
  { label: "Trao đổi ngoài bài học", value: "04:32" },
  { label: "Nội dung lặp lại", value: "02:41" },
  { label: "Sự cố kỹ thuật", value: "01:42" },
];

export const zoomRecordings = [
  {
    id: "z1",
    title: "Chữa bài: Tính bằng cách thuận tiện",
    date: "18/08/2026",
    duration: "45:32",
    host: "Cô Nguyễn Thu Hà",
    hue: 220,
  },
  {
    id: "z2",
    title: "Luyện tập: Phép nhân với số có hai chữ số",
    date: "15/08/2026",
    duration: "38:10",
    host: "Cô Nguyễn Thu Hà",
    hue: 190,
  },
  {
    id: "z3",
    title: "Ôn tập giữa kỳ – Hình học cơ bản",
    date: "11/08/2026",
    duration: "52:47",
    host: "Thầy Trần Minh",
    hue: 275,
  },
  {
    id: "z4",
    title: "Bài mới: Phân số và cách rút gọn",
    date: "04/08/2026",
    duration: "41:05",
    host: "Cô Lê Phương",
    hue: 150,
  },
];

export const transcript: TranscriptItem[] = [
  { time: "00:10", text: "Hôm nay cô sẽ hướng dẫn các em cách tính thuận tiện..." },
  { time: "00:24", text: "Trước tiên chúng ta xét ý A của bài tập số 3 trong sách." },
  {
    time: "00:35",
    range: "00:35 – 00:48",
    text: "“Các em có nhìn thấy màn hình của cô không?”",
    removed: true,
    reason: "Trao đổi kỹ thuật, không thuộc nội dung bài học.",
  },
  { time: "00:52", text: "Ta nhóm các số hạng có tổng tròn chục lại với nhau." },
  { time: "01:15", text: "Ví dụ 25 cộng 75 bằng 100, rất thuận tiện phải không nào." },
  {
    time: "01:42",
    range: "01:42 – 01:57",
    text: "Khoảng lặng 15 giây.",
    removed: true,
    reason: "Khoảng lặng dài.",
  },
  { time: "02:03", text: "Bây giờ các em thử làm phép tính tiếp theo cùng cô nhé." },
  {
    time: "02:40",
    range: "02:40 – 03:05",
    text: "“Cô nhắc lại một lần nữa cho bạn vào muộn...”",
    removed: true,
    reason: "Nội dung lặp lại.",
  },
  { time: "03:12", text: "Chúng ta cùng kiểm tra kết quả: 100 cộng 46 bằng 146." },
  { time: "03:48", text: "Như vậy ý A đã hoàn thành, các em ghi bài vào vở." },
];

export const processingSteps = [
  "Đã nhận diện nội dung bài giảng",
  "Đã xác định các chủ đề chính",
  "Đã chia cấu trúc bài học",
  "Đã phát hiện nội dung không cần thiết",
  "Đang dựng video bài giảng",
  "Chuẩn bị kết quả",
];

export const statusMessages = [
  "AI đang nghe và nhận diện nội dung...",
  "AI đang xác định các phần bài giảng...",
  "AI đang loại bỏ khoảng lặng...",
  "AI đang dựng video 2/3...",
  "AI đang hoàn thiện kết quả...",
];
