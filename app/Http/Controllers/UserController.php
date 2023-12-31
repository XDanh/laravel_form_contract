<?php

namespace App\Http\Controllers;

use App\Http\Resources\ResourceUser;
use App\Models\count;
use App\Models\Dichvu;
use App\Models\Thong_tin_khach_hang;
use App\Models\Thong_tin_hop_dong;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{

    public function index(): JsonResponse
    {

        return response()->json(
            new ResourceUser(Thong_tin_hop_dong::select('id', 'NGAY_KY_HD', 'NV', 'MA_HOP_DONG', 'TEN_KHACH_HANG', 'MA_SO_THUE', 'GIA_SAU_THUE', 'TRANG_THAI_DON_HANG', 'DICH_VU')->get())
        );

        /* return response()->json(new ResourceUser(Form2::all())); */
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request): JsonResponse
    {
        //return response()->json($request->all());

        $validator = Validator::make($request->all(), [
            'TEN_KHACH_HANG' => 'required',
            'MA_SO_THUE' => 'required|max:13',
            'MBHXH' => 'required|max:13',
            'NV' => 'required',
            'TINH_TP' => 'required',
            'QUAN_HUYEN' => 'required',
            'XA_PHUONG' => 'required',
            'SO_NHA' => 'required',
            'NGAY_KY_HD' => 'required',
            'LOAI_TB' => 'required',
            'MA_HOP_DONG' => 'required',
            'TRANG_THAI_DON_HANG' => 'required',
            'LOAI_GOI_CUOC' => 'required',
            'DICH_VU' => 'required',
            'GOI_CUOC' => 'required',
            'THOI_GIAN' => 'required',
            'SO_LUONG' => 'required',
            'GIA_THIET_BI' => 'required',
            'GIA_TRUOC_THUE' => 'required',
            'GIA_SAU_THUE' => 'required',
            'GHI_CHU' => 'required',
            'PDF' => 'required'
        ]);
        $temp = new ResourceUser(count::all());

        $number = $temp[0]['count_number'];

        $currentTime = date('Y-m-d');

        $dateDB = $temp[0]['date'];

        /*     return response()->json([$currentTime,$dateDB]);
    */
        if ($currentTime !== $dateDB) {

            $number = 1;
            $formattedValue = str_pad($number, 3, '0', STR_PAD_LEFT);

            $name = date("ymd") . $formattedValue;
            DB::table('count')
                ->update(['count_number' =>  $number, 'date' => $currentTime]);
        } else {
            $number = $temp[0]['count_number'] + 1;
            $formattedValue = str_pad($number, 3, '0', STR_PAD_LEFT);

            $name = date("ymd") . $formattedValue;
            DB::table('count')
                ->update(['count_number' =>  $number]);
        }
        $request->merge(['MA_HOP_DONG' => $name]);
        Thong_tin_hop_dong::create($request->all());


        return response()->json(['oke' => 'oke', 'status' => '200']);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        /*         return response()->json($request->all());
 */
        Thong_tin_hop_dong::where('id', $id)->update([
            'DICH_VU' => $request->input('DICH_VU'),
            'GHI_CHU' => $request->input('GHI_CHU'),
            'GIA_SAU_THUE' => $request->input('GIA_SAU_THUE'),
            'GIA_THIET_BI' => $request->input('GIA_THIET_BI'),
            'GIA_TRUOC_THUE' => $request->input('GIA_TRUOC_THUE'),
            'GOI_CUOC' => $request->input('GOI_CUOC'),
            'LOAI_GOI_CUOC' => $request->input('LOAI_GOI_CUOC'),
            'LOAI_TB' => $request->input('LOAI_TB'),
            'MA_SO_THUE' => $request->input('MA_SO_THUE'),
            'MBHXH' => $request->input('MBHXH'),
            'NGAY_KY_HD' => $request->input('NGAY_KY_HD'),
            'NV' => $request->input('NV'),
            'SO_LUONG' => $request->input('SO_LUONG'),
            'TEN_KHACH_HANG' => $request->input('TEN_KHACH_HANG'),
            'THOI_GIAN' => $request->input('THOI_GIAN'),
            'TRANG_THAI_DON_HANG' => $request->input('TRANG_THAI_DON_HANG'),
            'DIA_CHI' => $request->input('DIA_CHI'),
        ]);

        return response()->json(['mess' => 'oke', 'status' => '200']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $result = Thong_tin_hop_dong::find($id);

        if (!$result) return response()->json(['mess' => 'something wrong']);

        $result->delete();

        return response()->json(['mess' => 'oke', 'status' => '200']);
    }
}
