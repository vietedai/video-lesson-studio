# Course Creator AI

THIẾT KẾ PROTOTYPE: AI VIDEO TO COURSE

Hãy thiết kế lại UI/UX cho một tính năng AI tự động biến video lớp học/Zoom thành các video bài giảng ngắn gọn, hoàn chỉnh và sẵn sàng đưa vào khóa học trên LMS.

1. Bối cảnh sản phẩm

Đối tượng người dùng chính là giáo viên, không phải chuyên gia dựng video.

Giáo viên có thể:

Chọn video bài giảng đã lưu từ Zoom.

Hoặc upload video từ máy tính.

AI tự động phân tích nội dung video.

AI tự động xác định cấu trúc bài giảng.

AI tự chia video thành các bài/phần hợp lý.

AI tự loại bỏ khoảng lặng, lỗi kỹ thuật, trao đổi ngoài nội dung bài học, nội dung lặp lại hoặc không phù hợp.

AI tự cắt/ghép và dựng thành các video bài giảng thành phần.

Giáo viên xem sản phẩm cuối.

Nếu kết quả tốt → sử dụng ngay.

Nếu chưa phù hợp → giáo viên mới mở các chức năng chỉnh sửa.

2. Nguyên tắc UX quan trọng nhất

Thiết kế theo triết lý:

"AI làm trước – Giáo viên duyệt thành phẩm – Chỉ chỉnh sửa khi cần."

KHÔNG thiết kế workflow dài như:

Upload → Phân tích → Xem kết quả phân tích → Duyệt → Chọn đoạn → Dựng → Review → Xuất bản.

Happy path phải cực ngắn:

Chọn video → AI biên tập → Thành phẩm

Người dùng lý tưởng chỉ cần:

Chọn video.

Bấm AI biên tập.

Xem kết quả.

Bấm Sử dụng các video này.

Các chức năng nâng cao phải sử dụng nguyên tắc Progressive Disclosure:

Mặc định ẩn.

Chỉ hiển thị khi giáo viên chủ động bấm "Chỉnh sửa", "Tùy chọn nâng cao", "Xem chi tiết".

Không làm giao diện chính trở nên phức tạp.

FLOW TỔNG THỂ

Thiết kế chỉ có 2 màn hình chính + 1 trạng thái AI processing:

SCREEN 1

Chọn video

↓

AI PROCESSING

AI tự động phân tích + biên tập + dựng video

↓

SCREEN 2

Bài giảng đã sẵn sàng

↓

Hai hướng:

Sử dụng ngay → Hoàn tất

hoặc

Chỉnh sửa → mở editor nâng cao

Không coi Editor là một bước bắt buộc.

SCREEN 1 – CHỌN VIDEO

Header

Title:

Tạo bài giảng từ video

Subtitle:

AI giúp thầy cô biến video lớp học thành các video bài giảng ngắn gọn, sẵn sàng sử dụng.

Giao diện sạch, thân thiện, không sử dụng thuật ngữ kỹ thuật về video editing.

Khu vực chọn nguồn

Hiển thị 2 card lớn nằm cạnh nhau.

Card 1 – Zoom

Icon camera/video.

Title:

Chọn từ Zoom

Description:

Sử dụng video từ các buổi học đã ghi hình trên Zoom.

Button:

Chọn video

Khi click mở modal danh sách Zoom Recording.

Modal hiển thị:

Thumbnail

Tên buổi học

Ngày ghi hình

Thời lượng

Người tổ chức

Radio/checkbox chọn video

Có search.

Có filter theo thời gian.

Footer:

Hủy

Chọn video này

Card 2 – Upload

Icon upload.

Title:

Tải video lên

Description:

Chọn video bài giảng có sẵn trên máy tính.

Hỗ trợ drag & drop.

Hiển thị:

MP4, MOV, WebM

Có progress khi upload.

SAU KHI ĐÃ CHỌN VIDEO

Thay khu vực lựa chọn bằng Video Source Card.

Ví dụ:

Thumbnail

Chữa bài: Tính bằng cách thuận tiện

Video gốc

45:32

Ngày ghi hình: 18/08/2026

Nguồn: Zoom

Có các action nhỏ:

▶ Xem video

Đổi video

CTA CHÍNH

Button lớn, nổi bật:

✨ AI biên tập bài giảng

Đây phải là Primary CTA mạnh nhất màn hình.

Bên dưới có text link:

⚙ Tùy chọn nâng cao

Mặc định collapsed.

ADVANCED OPTIONS

Chỉ mở khi click "Tùy chọn nâng cao".

Không chuyển màn hình.

Expand inline hoặc side panel nhỏ.

Title:

Tùy chọn AI

Cách tổ chức nội dung

Radio:

● AI tự đề xuất – Khuyến nghị

Description:

AI tự xác định cách chia bài phù hợp nhất với nội dung.

○ Theo trình tự bài giảng

Giữ nguyên thứ tự nội dung trong video gốc.

○ Theo chủ đề

AI gom các nội dung cùng chủ đề thành từng bài.

Default:

AI tự đề xuất

AI tự động loại bỏ

Checkbox, mặc định ON:

✓ Khoảng lặng dài

✓ Trao đổi ngoài nội dung bài học

✓ Sự cố kỹ thuật

✓ Nội dung lặp lại

✓ Các đoạn không liên quan

Không đưa các cấu hình kỹ thuật như threshold, frame, bitrate, codec... lên giao diện dành cho giáo viên.

Có button:

Áp dụng

AI PROCESSING SCREEN

Sau khi giáo viên bấm:

AI biên tập bài giảng

Không yêu cầu thêm thao tác.

Hiển thị một processing screen thân thiện.

Title:

AI đang biên tập bài giảng

Subtitle:

Thầy cô không cần làm gì thêm. AI đang tạo các video bài giảng từ video gốc.

Progress bar lớn.

Ví dụ:

68%

Bên dưới thể hiện các công việc AI đang thực hiện:

✓ Đã nhận diện nội dung bài giảng

✓ Đã xác định các chủ đề chính

✓ Đã chia cấu trúc bài học

✓ Đã phát hiện nội dung không cần thiết

● Đang dựng video bài giảng

○ Chuẩn bị kết quả

Không sử dụng quá nhiều thông tin kỹ thuật.

Có thể thêm các status message động:

AI đang loại bỏ khoảng lặng...

AI đang xác định các phần bài giảng...

AI đang dựng video 2/4...

SCREEN 2 – BÀI GIẢNG ĐÃ SẴN SÀNG

Đây là màn hình QUAN TRỌNG NHẤT của prototype.

Không gọi là:

"Kết quả phân tích"

Không gọi là:

"Kết quả AI"

Không gọi là:

"Duyệt bài"

Title lớn:

✓ Bài giảng đã sẵn sàng

Subtitle:

AI đã biên tập video và tạo các bài học bên dưới.

COURSE SUMMARY

Hiển thị card tổng quan.

Title:

Tính bằng cách thuận tiện

Description:

Bài giảng hướng dẫn học sinh phương pháp tính thuận tiện thông qua các ví dụ và bài tập thực hành.

Có icon Edit nhỏ bên cạnh Title.

Khi click cho phép sửa:

Tên bài giảng

Mô tả

Không chuyển màn hình.

THỐNG KÊ TỐI GIẢN

Không hiển thị các số khó hiểu như:

"62 câu giữ lại"

"4 câu cắt"

Thay bằng visualization đơn giản:

Video gốc

45:32

↓

Sau biên tập

28:16

AI đã tạo 3 bài

Có thể thể hiện:

Tiết kiệm 17:16 nội dung không cần thiết

Không làm statistics trở thành phần nổi bật nhất.

DANH SÁCH VIDEO BÀI HỌC

Không sử dụng Data Table như UI cũ.

Sử dụng Lesson Cards.

Ví dụ:

Thumbnail

01. Chữa bài toán bằng cách thuận tiện – Ý A

10:24

AI đã biên tập từ video gốc.

Buttons:

▶ Xem

Text action:

✏ Chỉnh sửa

Drag handle ở bên phải để thay đổi thứ tự nếu cần.

Thumbnail

02. Chữa bài toán bằng cách thuận tiện – Ý B

09:12

Buttons:

▶ Xem

✏ Chỉnh sửa

Thumbnail

03. Tổng kết và lưu ý

08:40

Buttons:

▶ Xem

✏ Chỉnh sửa

Các bài mặc định đều được chọn để sử dụng.

Không yêu cầu giáo viên tick checkbox nếu không cần thiết.

Nếu giáo viên xóa/ẩn bài mới coi là không sử dụng.

PREVIEW VIDEO

Khi click:

▶ Xem

Mở modal lớn.

Hiển thị:

Video Player

Tên bài

Thời lượng

Có Previous / Next để giáo viên xem nhanh các bài.

Footer:

Đóng

Chỉnh sửa

Không bắt giáo viên đi vào Editor chỉ để xem video.

PRIMARY ACTION

Sticky action bar ở cuối màn hình.

Primary CTA lớn:

✓ Sử dụng các video này

Secondary:

✏ Chỉnh sửa

Không sử dụng CTA:

"Dựng video"

vì tại thời điểm này AI đã dựng xong video.

AI EDIT SUMMARY – COLLAPSED

Bên dưới Course Summary có một text link nhỏ:

ⓘ AI đã biên tập những gì?

Mặc định collapsed.

Khi click mới mở.

Ví dụ:

AI đã loại bỏ 17:16

Khoảng lặng: 08:21

Trao đổi ngoài bài học: 04:32

Nội dung lặp lại: 02:41

Sự cố kỹ thuật: 01:42

Button:

Xem chi tiết

Không hiển thị mặc định để tránh gây nhiễu cho giáo viên.

CHỈNH SỬA BÀI HỌC

Khi giáo viên click:

✏ Chỉnh sửa

Không lập tức đưa vào video editor phức tạp.

Trước tiên mở một Side Panel.

Title:

Chỉnh sửa bài học

Cho phép:

Tên bài

Input:

Chữa bài toán bằng cách thuận tiện – Ý A

Thời lượng

10:24

Các action đơn giản

Đổi tên

Chia thành 2 bài

Gộp với bài kế tiếp

Xóa bài

Primary:

Chỉnh nội dung video

VIDEO EDITOR – CHỈ MỞ KHI CẦN

Chỉ khi giáo viên bấm:

Chỉnh nội dung video

mới mở Full Screen Editor.

Không đưa Editor vào happy path.

Layout Desktop:

Left/Main Area – Video

Video player lớn.

Play / Pause

Current time / Total time

Timeline

Timeline trực quan.

Thể hiện:

Các đoạn đang được giữ

Các đoạn AI đã loại bỏ

Marker giữa các đoạn

Cho phép click vào timeline để seek video.

Không cần tạo video editor chuyên nghiệp kiểu Adobe Premiere.

Editor phải đơn giản cho giáo viên.

Right Panel – Transcript

Title:

Nội dung bài giảng

Transcript đồng bộ với video.

Ví dụ:

00:10

Hôm nay cô sẽ hướng dẫn các em cách tính thuận tiện...

00:24

Trước tiên chúng ta xét ý A...

Các đoạn AI đã loại bỏ phải hiển thị khác biệt.

Ví dụ:

AI đã loại bỏ

00:35 – 00:48

"Các em có nhìn thấy màn hình của cô không?"

Reason:

Trao đổi kỹ thuật, không thuộc nội dung bài học.

Button:

↩ Khôi phục đoạn này

Ví dụ khác:

01:42 – 01:57

Khoảng lặng 15 giây.

Reason:

Khoảng lặng dài.

Button:

↩ Khôi phục

AI EXPLAINABILITY

Một nguyên tắc quan trọng:

Khi AI loại bỏ nội dung, giáo viên phải có khả năng hiểu:

AI đã loại bỏ đoạn nào?

Tại sao AI loại bỏ?

Có thể khôi phục không?

Không yêu cầu giáo viên phải xem toàn bộ thông tin này.

Chỉ hiển thị khi giáo viên vào Editor hoặc bấm "Xem chi tiết".

SAVE EDIT

Trong Full Screen Editor:

Top-right:

Hủy

Lưu thay đổi

Sau khi lưu:

AI render lại riêng video đang chỉnh.

Hiển thị:

Đang cập nhật video...

Sau đó quay lại:

Bài giảng đã sẵn sàng

Không bắt render lại toàn bộ khóa học nếu chỉ sửa một video.

SỬ DỤNG VIDEO

Khi giáo viên bấm:

✓ Sử dụng các video này

Mở modal:

Sử dụng bài giảng

Các video đã sẵn sàng.

Cho phép:

Đưa vào khóa học trên LMS

Primary CTA.

Secondary options:

Tải các video

Lưu bản nháp

Nếu chọn LMS:

Cho phép:

Chọn khóa học có sẵn

Hoặc tạo khóa học mới

Sau đó:

Thêm vào khóa học

Success state:

✓ Hoàn tất

3 video bài giảng đã được thêm vào khóa học.

Buttons:

Xem khóa học

Tạo bài giảng khác

VISUAL DESIGN

Thiết kế Web-first.

Phong cách:

Modern EdTech

Professional

Friendly

Minimal

AI-assisted

Dễ sử dụng với giáo viên không giỏi công nghệ

Không thiết kế giống professional video editing software.

Ưu tiên:

White background

Card layout

Border nhẹ

Border radius 10–14px

Shadow rất nhẹ

Khoảng trắng rộng

Typography rõ ràng

Primary color blue

Success green

AI có thể dùng subtle blue/purple gradient nhưng không lạm dụng

Icon sử dụng Lucide.

Không sử dụng quá nhiều icon trang trí.

BUTTON HIERARCHY

Mỗi màn hình chỉ nên có 1 Primary CTA rõ ràng.

Screen 1:

✨ AI biên tập bài giảng

Screen Result:

✓ Sử dụng các video này

Editor:

Lưu thay đổi

Các chức năng khác phải là secondary hoặc text button.

UX RULES

Luôn ưu tiên:

Simple first → Advanced on demand

Không bắt giáo viên phải:

hiểu timeline

hiểu transcript

hiểu thuật toán AI

lựa chọn từng đoạn

duyệt từng câu

cấu hình video

dựng từng video

AI phải làm tất cả những việc này mặc định.

Chỉ mở các chức năng chuyên sâu khi giáo viên chủ động yêu cầu.

PROTOTYPE INTERACTIONS

Prototype phải click được đầy đủ các flow quan trọng:

Happy Path

Chọn video → AI biên tập → Processing → Bài giảng đã sẵn sàng → Xem video → Sử dụng → Hoàn tất

Edit Path

Bài giảng đã sẵn sàng → Chỉnh sửa bài → Side Panel → Chỉnh nội dung video → Editor → Khôi phục/cắt đoạn → Lưu → quay lại kết quả

Advanced Path

Chọn video → Tùy chọn nâng cao → thay đổi cách AI tổ chức → AI biên tập

AI Explain Path

Bài giảng đã sẵn sàng → AI đã biên tập những gì → Xem chi tiết → xem các đoạn AI đã loại bỏ

DỮ LIỆU MOCK CHO PROTOTYPE

Video nguồn:

Chữa bài: Tính bằng cách thuận tiện

Thời lượng:

45:32

AI tạo thành:

Bài 1

Chữa bài toán bằng cách thuận tiện – Ý A
10:24

Bài 2

Chữa bài toán bằng cách thuận tiện – Ý B
09:12

Bài 3

Tổng kết và lưu ý
08:40

Tổng sau biên tập:

28:16

Đã loại bỏ:

17:16

Lý do:

08:21 khoảng lặng

04:32 trao đổi ngoài bài

02:41 nội dung lặp lại

01:42 sự cố kỹ thuật

YÊU CẦU QUAN TRỌNG CUỐI CÙNG

Khi thiết kế prototype, hãy luôn kiểm tra bằng câu hỏi:

"Một giáo viên bình thường có thể tạo ra sản phẩm mà gần như không cần biết gì về video editing hay không?"

Nếu một chức năng không cần thiết cho 80% giáo viên:

Ẩn nó khỏi giao diện mặc định.

Nếu AI có thể quyết định thay giáo viên:

Cho AI đề xuất mặc định.

Nếu giáo viên chỉ cần kiểm tra khi có vấn đề:

Đưa chức năng đó vào Chỉnh sửa/Xem chi tiết.

Mục tiêu UX cuối cùng phải tạo cảm giác:

Tôi chọn video → AI làm giúp tôi → bài giảng đã sẵn sàng.

Không tạo cảm giác:

Tôi upload video → AI phân tích → sau đó tôi phải làm công việc biên tập video.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://video-lesson-studio.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c000bc12-12fb-4558-b97c-28638f300ff0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
