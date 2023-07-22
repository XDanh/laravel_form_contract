import { populateServices, populatePacks } from "./ajaxHelpers.js";
import {
  listProvince,
  listWard,
  listDistrict,
  provinceSelected,
  districtSelected,
  wardSelected,
  getProvinces,
  getDistricts,
  getWards,
  handleProvinceChange,
  handleDistrictChange,
  handleWardChange
} from "./locationUtils.js";

var contractData

$(document).ready(function () {
  $.ajax({
    url: "http://127.0.0.1:8000/api/contracts",
    type: "GET",
    success: function (data) {
      console.log(data)
      if (data) {
        var contracts = data
        $("#contracts").dataTable({
          data: contracts,
          ordering: true,
          select: true,
          columns: [{
            data: "NV" || null
          },
          {
            data: "TEN_KHACH_HANG" || null
          },
          {
            data: "MA_HOP_DONG" || null
          },
          {
            data: "MA_SO_THUE" || null
          },
          {
            data: "NGAY_KY_HD" || null
          },
          {
            data: "DICH_VU" || null
          },
          {
            data: "LOAI_DON_HANG" || null
          },
          {
            data: "GIA_SAU_THUE" || null
          },
          {
            data: "TRANG_THAI_DON_HANG" || null
          },
          {
            data: null,
            defaultContent: '<button type="button" class="btn btn-detail btn-info">Xem chi tiết</button>'
          }
          ]
        });
      }
    }
  });
});

// SHOW DETAIL
$("#contracts").on("click", ".btn-detail", function () {
  var data = $("#contracts").DataTable().row($(this).parents("tr")).data();
  $.ajax({
    url: `http://127.0.0.1:8000/api/contract/${data.id}`,
    type: "GET",
    success: function (contract) {
      contractData = contract.data[0]
      $("#staffInput").append(`<option value=${contractData.NV}>${contractData.NV}</option>`);
      $("#viewTenKH").text(contract.data[0].TEN_KHACH_HANG || "Không có");
      $("#viewDiaChi").text(contract.data[0].DIA_CHI || "Không có");
      $("#viewMasothue").text(contract.data[0].MA_SO_THUE || "Không có");
      $("#viewBHXH").text(contract.data[0].MBHXH || "Không có");
      $("#viewNhanvien").text(contract.data[0].NV || "Không có")
      $("#viewNgaykyhd").text(contract.data[0].NGAY_KY_HD || "Không có")
      $("#viewMasohd").text(contract.data[0].MA_HOP_DONG || "Không có")
      $("#viewTrangthaidonhang").text(contract.data[0].TRANG_THAI_DON_HANG || "Không có")
      $("#viewLoaidonhang").text(contract.data[0].LOAI_DON_HANG || "Không có")
      $("#viewDichvu").text(contract.data[0].DICH_VU || "Không có")
      $("#viewGoicuoc").text(contract.data[0].GOI_CUOC || "Không có")
      $("#viewThoigian").text(contract.data[0].THOI_GIAN || "Không có")
      $("#viewLoaithietbi").text(contract.data[0].LOAI_TB || "Không có")
      $("#viewGiathietbi").text(contract.data[0].GIA_THIET_BI || "Không có")
      $("#viewGiatruocthe").text(contract.data[0].GIA_TRUOC_THUE || "Không có")
      $("#viewVAT").text(contract.data[0].VAT || "Không có")
      $("#viewGiasauthe").text(contract.data[0].GIA_SAU_THUE || "Không có")
      $("#viewGhichu").text(contract.data[0].GHI_CHU || "Không có")
      $("#viewMagiaodich").text(contract.data[0].MA_GD || "Không có")
      $("#viewMathuebao").text(contract.data[0].MA_THUE_BAO || "Không có")
      $("#viewUsername").text(contract.data[0].USERNAME || "Không có")
      $("#viewSoseri").text(contract.data[0].SO_SERI || "Không có")
      $("#viewSohd").text(contract.data[0].SO_HD || "Không có")
      $("#viewMatracuuhoadon").text(contract.data[0].MA_TRA_CUU || "Không có")
      $("#viewNgayxuathoadon").text(contract.data[0].NGAY_XUAT_HOA_DON || "Không có")

      $("#viewDetailModal").modal("show");
    }
  })


  // handle edit btn
  // Hàm để đổ dữ liệu vào các trường nhập liệu của giao diện
  function populateFields(contractData) {
    $("#TenKH").val(contractData.TEN_KHACH_HANG);
    $("#MaThue").val(contractData.MA_SO_THUE);
    $("#MaBHXH").val(contractData.MBHXH);
    $("#diachi").val(contractData.DIA_CHI);
    $("#staffInput").val(contractData.NV);
    $("#ngaykyhd").val(contractData.NGAY_KY_HD);
    $("#mahd").val(contractData.MA_HOP_DONG);
    $("#orderStatusInput").val(contractData.TRANG_THAI_DON_HANG);
    $("#orderTypeInput").val(contractData.LOAI_DON_HANG);
    $("#serviceInput").val(contractData.DICH_VU);
    $("#packInput").val(contractData.GOI_CUOC);
    $("#timeInput").val(contractData.THOI_GIAN);
    $("#giathietbi").val(contractData.GIA_THIET_BI);
    $("#giatruocthue").val(contractData.GIA_TRUOC_THUE);
    $("#giasauthue").val(contractData.GIA_SAU_THUE);
    $("#ghichu").val(contractData.GHI_CHU);
  }



  // Sự kiện khi click vào nút #btnEdit
  $("#btnEdit").on("click", function () {
    // Lấy danh sách TỈNH/THÀNH PHỐ và đổ vào dropdown #provinceInput
    getProvinces();

    // Lấy danh sách QUẬN/HUYỆN và lưu vào biến listDistrict
    getDistricts();

    // Lấy danh sách XÃ/PHƯỜNG và lưu vào biến listWard
    getWards();

    // Xử lý sự kiện thay đổi TỈNH/THÀNH PHỐ
    handleProvinceChange();

    // Xử lý sự kiện thay đổi QUẬN/HUYỆN
    handleDistrictChange();

    // Xử lý sự kiện thay đổi XÃ/PHƯỜNG
    handleWardChange();

    populateFields(contractData);

    populateServices();

    populatePacks(contractData.DICH_VU, contractData.GOI_CUOC);

    $("#editModal").modal("show");
  });

  // nút cập nhật đơn hàng
  $("#btnUpdateOrder").on("click", function () {
    var contract = $("#contracts").DataTable().row($("#contracts tr.selected")).data();
    console.log(contract)
    $("#updateModal").modal("show");
  })

  // handle delete btn
  $("#btnDelete").on("click", function () {
    var dataDelete = $("#contracts").DataTable().row($("#contracts tr.selected")).data();
    $("#deleteConfirmationModal").modal("show");

    $("#btnConfirmDelete").on("click", function () {
      console.log(data.id)
      $("#deleteConfirmationModal").modal("hide");
      $("#viewDetailModal").modal("hide");
      var dataDeleted = $("#contracts").DataTable().row($("#contracts tr.selected")).data();
    });
  });
});