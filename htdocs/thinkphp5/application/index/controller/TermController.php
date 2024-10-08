<?php
namespace app\index\controller;
use think\Controller;
use app\common\model\Term;
use think\request;

class TermController extends Controller
{
    // 获取学期列表
    public function index()
    {
        $terms = Term::all();
        return json($terms);
    }
}
