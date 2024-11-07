<?php
namespace app\common\model;
use think\Model;

class Term extends Model
{
    // 学校表
    protected $table = 'term';

    // 关联school表
    public function school()
    {
        return $this->belongsTo('School');
    }

    public function courses()
    {
        return $this->hasMany('Course', 'term_id', 'id');
    }
}
