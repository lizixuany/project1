<?php
namespace app\common\model;
use think\Model;

class Clazz extends Model
{
    protected $table = 'clazz';
    
   // 关联school表
   public function school()
   {
       return $this->belongsTo('School');
   }
}