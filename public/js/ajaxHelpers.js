let temp = 0
export let dichvu = ""
export let goicuoc = ""
export let loaigoi = ""

//DICH VU
function populateServices(selectedDichVu, selectedGoiCuoc, loaigoi) {
  $.ajax({
    url: "http://127.0.0.1:8000/api/dichvu",
    type: "GET",
    success: function (data) {
      $.each(data.data, function (index, value) {
        if (value.DICH_VU === selectedDichVu) {
          populatePacks(value.MaDV, selectedGoiCuoc, loaigoi)
        }
        const option = `<option value="${value.MaDV}" ${value.DICH_VU === selectedDichVu ? 'selected' : ''}>${value.DICH_VU}</option>`;
        $("#serviceInput").prepend(option);
      });

      $("#serviceInput").on('change', function () {
        // Lấy giá trị mới khi option được chọn
        for (let i = 0; i < data.data.length; i++) {
            if (data.data[i].MaDV == $("#serviceInput").val()) {
                dichvu = data.data[i].DICH_VU
                console.log(data.data[i].DICH_VU);
            }
          }
        populatePacks($("#serviceInput").val(), selectedGoiCuoc, loaigoi)
      });
    }
  });
}

//GOI CUOC
function populatePacks(selectedDichVu, contractDataGoiCuoc, loaigoi = "") {
  $.ajax({
    url: `http://127.0.0.1:8000/api/goicuoc/${selectedDichVu}`,
    type: "GET",
    success: function (data) {
      if (data?.data.length > 0) {
        $("#packInput").empty(); // Xóa danh sách cũ trước khi đổ dữ liệu mới
        $("#packInput").prepend(`<option value="" >---Chọn gói cước---</option>`);

        $.each(data.data, function (index, value) {
          // Kiểm tra nếu giá trị trong danh sách trùng với contractData.GOI_CUOC, thì set là giá trị mặc định được chọn
          if (!contractDataGoiCuoc) {
            $("#packInput").prepend(`<option value=${value.MaGC}>${value.GOI_CUOC}</option>`);
          } else {
            const isSelected = value.GOI_CUOC.toString().trim().toLowerCase() == contractDataGoiCuoc.toString().trim().toLowerCase() ? "selected" : "";
            if (!!isSelected) {
              populatePackTypes(loaigoi, value.MaGC)
            }
            $("#packInput").prepend(`<option value=${value.MaGC} ${isSelected}>${value.GOI_CUOC}</option>`);
          }

        });
        $("#packInput").on("change", function (e) {
            for (let i = 0; i < data.data.length; i++) {
                if (data.data[i].MaGC == $("#packInput").val()) {
                    goicuoc = data.data[i].GOI_CUOC
                    console.log(data.data[i].GOI_CUOC);
                }
              }
          populatePackTypes("", e.target.value)
        })
      } else {
        $("#packInput").empty();
      }
    }
  });
}

//LOAI GOI CUOC
function populatePackTypes(selectedPackType = "", selectedpackID) {
  $.ajax({
    url: `http://127.0.0.1:8000/api/loaigoi?MaGC=${selectedpackID}`,
    type: "GET",
    success: function (data) {
      if (data.data) {
        $("#packTypeInput").empty();

        $("#packTypeInput").prepend(`<option value="" >---Chọn loại gói cước---</option>`);

        data.data.forEach(type => {
          if (type.LOAI_GOI === selectedPackType) {
            populateTime(type.MaLoai, selectedpackID)
          }
          $("#packTypeInput").append(`<option value="${type.MaLoai}" ${type.LOAI_GOI === selectedPackType ? 'selected' : ''}>${type.LOAI_GOI} </option>`);
        });

        $("#packTypeInput").on("change", function (e) {
            for (let i = 0; i < data.data.length; i++) {
                if (data.data[i].MaLoai == $("#packTypeInput").val()) {
                    loaigoi = data.data[i].LOAI_GOI
                }
              }
          populateTime(e.target.value, selectedpackID)
        })


      }
    }
  });
}
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency:'VND',
    minimumFractionDigits: 0
  })
//THOI GIAN
function populateTime(MaLoai, MaGC, selectedTime) {
  $.ajax({
    url: `http://127.0.0.1:8000/api/thoihan?MaGC=${MaGC}&MaLoai=${MaLoai}`,
    type: "GET",
    success: function (data) {

      if (data.data) {
        $("#timeInput").empty();
        $("#timeInput").prepend(`<option value="" >---Chọn thời gian---</option>`);

        data.data.forEach(time => {
          $("#timeInput").prepend(`<option value="${time.MaTH}" ${time.THOI_HAN === selectedTime ? 'selected' : ''}>${time.THOI_HAN} </option>`);
        })
      } else {
        $("#timeInput").empty();
      }
      var AffterPrice  = $( "#GIA_SAU_THUE" ).val();

      $("#timeInput").on("change", function (e) {
        const selectedTime = $("#timeInput").val();
        const selectedData = data.data.find(time => time.MaTH === parseInt(selectedTime));
        temp = selectedData.GIA_TRUOC_THUE||0
        $("#GIA_TRUOC_THUE").val(selectedData ? formatter.format(selectedData.GIA_TRUOC_THUE) : "");
        device(MaLoai,MaGC,e.target.value)
      });
    }
  })
}
//THIET BI
function device(MaLoai, MaGC, MaTH) {

    $.ajax({
      url: `http://127.0.0.1:8000/api/thietbi?MaGC=${MaGC}&MaLoai=${MaLoai}&MaTH=${MaTH}`,
      type: "GET",
      success: function (data) {
/*       console.log(Number(data.data[0].GIA_TB) )
 */        if (data.data[0]?.THIET_BI !== "Mua") {
            $('#SO_LUONG').attr("disabled", "disabled");

            }else{

                $('#SO_LUONG').val(1);
            }
            myfion()
      if( Number(data.data[0]?.GIA_TB)){
            $('#GIA_TB').val(Number(data.data[0]?.GIA_TB))
      }else{
        $('#GIA_TB').val(0)
      }

    }
    })
  }
function myfion(){
    $('#SO_LUONG').on('change',function(e){
        let BeforeVatPrice = $('#GIA_TRUOC_THUE').val()
        let DevicePrice = $('#GIA_TB').val()*e.target.value
        $('#Sum').text(e.target.value,' x ',$('#GIA_TB').val(),' = ',DevicePrice)
/*         console.log(Number(DevicePrice+BeforeVatPrice)/10)
 */        var sum_price = Number(DevicePrice)+Number(temp)
        $('#GIA_SAU_THUE').val(formatter.format(sum_price+sum_price/10))
        console.log(sum_price);

      })
}
export { populateServices, populatePacks, populatePackTypes, populateTime };
