/*create database marketonline;*/
create database market_online; 
use market_online;

create table nguoi_dung(
	ma_so int not null auto_increment,
    ten_dang_nhap varchar(255) not null,
    mat_khau varchar(255) not null,
    ho_ten varchar(255) not null,
    email varchar(255) not null,
    so_dien_thoai varchar(255) not null,
    gioi_tinh int not null,
    ngay_sinh date not null,
    dia_chi varchar(255) not null,
    ten_don_vi varchar(255),
    loai int not null,
    -- loai 1: nguoi mua, 2: nguoi ban, 3: nguoi van chuyen
    primary key(ma_so, ten_dang_nhap)
);

create table gio_hang(
	ma_so int not null auto_increment,
    tong_tien double,
    tinh_trang int not null,
    primary key(ma_so)
);

create table lich_su_ban_hang(
	ma_so int not null auto_increment,
    ngay_ban date not null,
    so_luong int not null,
    primary key(ma_so)
);

create table chi_tiet_gio_hang(
	ma_so int not null auto_increment,
    so_luong int not null,
    primary key(ma_so)
);

create table cua_hang(
	ma_so int not null auto_increment,
    ten_cua_hang varchar(255) not null,
    ngay_tham_gia date not null,
    mo_ta varchar(255) not null,
    primary key(ma_so)
);

create table phieu_dat_hang(
	ma_so int not null auto_increment,
    tong_tien double not null,
    ngay_lap_phieu date not null,
    chi_phi_giao_hang double not null,
 --    0: chua thanh toan, 1: da_thanh_toan 
    tinh_trang_thanh_toan int not null,
    primary key(ma_so)
);

create table loai_san_pham(
	ma_so int not null auto_increment,
    ten varchar(255) not null,
    cua_hang int not null,
    primary key(ma_so),
    constraint fk_cua_hang_loai_san_pham foreign key(cua_hang) references cua_hang(ma_so)
);

create table san_pham (
	ma_so int not null auto_increment,
    ten_san_pham varchar(255) not null,
    gia_tien double not null,
    so_luong int not null,
    mo_ta varchar(2000),
    hinh_anh varchar(255),
    loai_san_pham int not null,
    cua_hang int not null,
    primary key(ma_so),
    constraint fk_loai_san_pham_san_pham foreign key(loai_san_pham) references loai_san_pham(ma_so),
    constraint fk_cua_hang_san_pham foreign key (cua_hang) references cua_hang(ma_so)
);

create table thanh_toan(
	ma_so int not null auto_increment,
    ngan_hang varchar(255),
    dia_chi varchar(255),
    -- 1: Thanh toan khi nhan hang, 2: Thanh toan truc tuyen,
    loai int not null,
    primary key(ma_so)
);

create table don_van_chuyen(
	ma_so int not null auto_increment,
    dia_chi_nhan varchar(255) not null,
 --    0: Khong nhan, 1: nhan
    nhan_tien_nguoi_mua int not null,
    tong_tien double not null,
    ngay_giao date not null,
    ma_phieu int not null,
    constraint fk_ma_phieu_don_van_chuyen foreign key(ma_phieu) references phieu_dat_hang(ma_so),
    primary key(ma_so)
);

alter table nguoi_dung
add column gio_hang int,
add constraint fk_gio_hang_nguoi_dung foreign key(gio_hang) references gio_hang(ma_so);

alter table nguoi_dung
add column cua_hang int,
add constraint fk_cua_hang_nguoi_dung foreign key(cua_hang) references cua_hang(ma_so);

alter table lich_su_ban_hang
add column cua_hang int not null,
add constraint fk_cua_hang_lich_su_ban_hang foreign key(cua_hang) references cua_hang(ma_so);

alter table chi_tiet_gio_hang
add column gio_hang int not null,
add column san_pham int not null,
add constraint fk_gio_hang_chi_tiet_gio_hang foreign key(gio_hang) references gio_hang(ma_so),
add constraint fk_san_pham_chi_tiet_gio_hang foreign key(san_pham) references san_pham(ma_so);

alter table phieu_dat_hang
add column nguoi_dung int not null,
add constraint fk_nguoi_dung_phieu_dat_hang foreign key(nguoi_dung) references nguoi_dung(ma_so),
add column thanh_toan int not null,
add constraint fk_thanh_toan_phieu_dat_hang foreign key(thanh_toan) references thanh_toan(ma_so),
add column gio_hang int not null,
add constraint fk_gio_hang_phieu_dat_hang foreign key(gio_hang) references gio_hang(ma_so);

alter table don_van_chuyen
add column nhan_vien int not null,
add constraint fk_nhan_vien_don_van_chuyen foreign key(nhan_vien) references nguoi_dung(ma_so);

alter table lich_su_ban_hang
add column san_pham int not null,
add constraint fk_san_pham_lich_su_ban_hang foreign key(san_pham) references san_pham(ma_so);

-- --------------------------------------------------------------------------------------

use market_online;
insert into cua_hang values 
(1,"LAPTOP SHOP","2020-08-22","<ol><li>Chuyên kinh doanh <strong>laptop</strong></li><li>Hàng hóa chất lượng cao</li><li>Giá cả phải chăng</li><li>Bảo hành lâu dài</li><li>Nhiều ưu đãi hấp dẫn</li></ol>");

insert into gio_hang values 
(1,0);

insert into nguoi_dung values
(1,"quanghuyabc9","1b2c21c932284c05b4784e6b65c7c3b80a119d7e0529a602aed75e1bbe45d4281741658f8c6","Trần Phúc Quang Huy","quanghuyabc9@gmail.com","0327292074",1,"1999-08-24","213 NVC",NULL,2,NULL,1),
(3,"longpham123","3533626509445258ddb35b554f27bf75be9480fb94e1040e7a081f53c5527fed1741bb8f597","Phạm Đình Long","longpham135@gmail.com","0327292099",1,"2020-08-05","213 NVC",NULL,1,1,NULL);

insert into loai_san_pham values 
(1,"Apple (Macbook)",1),
(2,"Asus",1),
(3,"Dell",1),
(4,"Acer",1),
(5,"HP",1),
(6,"Lenovo",1),
(7,"MSI",1);

insert into san_pham values 
(4,"MacBook Air 13\" 2017 1.8GHz Core i5 128GB",19490000,10,"<p><a href=\"https://fptshop.com.vn/may-tinh-xach-tay/macbook-air-13-128gb-mqd32saa\" target=\"_blank\" style=\"background-color: transparent; color: rgb(24, 72, 122);\"><strong>Macbook Air 13 128 GB MQD32SA/A (2017)</strong></a><strong style=\"background-color: transparent; color: rgb(51, 51, 51);\">&nbsp;với thiết kế không thay đổi, vỏ nhôm sang trọng, siêu mỏng và siêu nhẹ, hiệu năng được nâng cấp, thời lượng pin cực lâu, phù hợp cho nhu cầu làm việc văn phòng nhẹ nhàng, không cần quá chú trọng vào hiển thị của màn hình.</strong></p>","inputAvatar-1598104652758.jpeg",1,1),
(5,"MacBook Air 13\" 2019 1.6GHz Core i5 256GB",31990000,12,"<p><strong style=\"color: rgb(51, 51, 51);\">MacBook Air 256GB 2019 không chỉ là phương tiện làm việc cơ động lý tưởng mà còn là một tuyệt tác về thiết kế, với màn hình Retina tuyệt mỹ cùng kiểu dáng sang trọng, mỏng nhẹ đến không ngờ.</strong></p>","inputAvatar-1598104962495.png",1,1),
(7,"MacBook Air 13\" 2020 1.1GHz Core i3 256GB",28990000,3,"<p><strong style=\"color: rgb(51, 51, 51);\">MacBook Air 2020 siêu mỏng nhẹ giờ đây còn mạnh mẽ hơn bao giờ hết. Màn hình Retina tuyệt hảo, bàn phím Magic Keyboard mới cùng thời lượng pin cả ngày,&nbsp;</strong><a href=\"https://fptshop.com.vn/may-tinh-xach-tay/macbook-air-13-2020-1-1ghz-core-i3-8gb-256gb\" target=\"_blank\" style=\"color: rgb(24, 72, 122);\"><strong>Macbook Air 13 2020 256GB</strong></a><strong style=\"color: rgb(51, 51, 51);\">&nbsp;xứng đáng là chiếc laptop di động nhất hiện nay.</strong></p>","inputAvatar-1598105150243.png",1,1),
(8,"MacBook Air 13\" 2020 1.1GHz Core i5 512GB",34990000,7,"<p><strong style=\"color: rgb(51, 51, 51);\">Chiếc máy tính xách tay siêu mỏng nhẹ cơ động với màn hình Retina tuyệt đẹp, sức mạnh đáng kinh ngạc và bàn phím hoàn toàn mới,&nbsp;</strong><a href=\"https://fptshop.com.vn/may-tinh-xach-tay/macbook-air-13-2020-1-1ghz-core-i5-8gb-512gb\" target=\"_blank\" style=\"color: rgb(24, 72, 122);\"><strong>Macbook Air 13 2020 512GB</strong></a><strong style=\"color: rgb(51, 51, 51);\">&nbsp;chính là người bạn đồng hành luôn bên bạn cả khi làm việc cũng như giải trí.</strong></p>","inputAvatar-1598105446507.jpeg",1,1),
(10,"MacBook Pro 13\" 2020 Touch Bar 1.4GHz Core i5 256GB",34990000,7,"<p><strong style=\"color: rgb(51, 51, 51);\">Phiên bản tiêu chuẩn của MacBook Pro 13 2020 nay đã có bộ nhớ dung lượng tăng lên gấp đôi cùng bàn phím Magic Keyboard cơ chế cắt kéo mới, cho bạn trải nghiệm tuyệt vời trên chiếc MacBook di động, mạnh mẽ và thời trang.</strong></p>","inputAvatar-1598105930204.png",1,1),
(11,"Asus Vivobook X407UA-BV537T/Core i3-7020U/4GB/1TB/WIN10",8028000,20,"<p><a href=\"https://fptshop.com.vn/may-tinh-xach-tay/asus-vivobook-x407ua-bv537t-core-i3-7020u\" target=\"_blank\" style=\"color: rgb(24, 72, 122);\"><strong>Asus Vivobook X407UA</strong></a><strong style=\"color: rgb(51, 51, 51);\">&nbsp;là chiếc laptop phổ thông có ổ cứng dung lượng cao, cảm biến vân tay,&nbsp;</strong><a href=\"https://fptshop.com.vn/phan-mem/windows\" target=\"_blank\" style=\"color: rgb(24, 72, 122);\"><strong>hệ điều hành Windows 10</strong></a><strong style=\"color: rgb(51, 51, 51);\">&nbsp;trong mức giá rất rẻ, phù hợp với nhiều đối tượng.</strong></p>","inputAvatar-1598106033250.png",2,1);



