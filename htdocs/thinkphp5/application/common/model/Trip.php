<?php
namespace app\common\model;
use think\Model;

class Trip extends Model
{
    // 我的课程表
    protected $table = 'lesson';

    // 关联course表
    public function course()
    {
        return $this->belongsTo('Course');
    }

    // 关联user表
    public function user()
    {
        return $this->belongsTo('User');
    }
}

