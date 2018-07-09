# -*- coding:utf-8 -*-

import zipfile
import os, shutil



def zip_file(filelist, zipfname, basedir):
    zf = zipfile.ZipFile(zipfname, 'w', zipfile.zlib.DEFLATED)
    for file in filelist:
        arcname = file[len(basedir):]
        zf.write(file, arcname)
    zf.close()

def zip_dir(dirname, zipfname):
    filelist = []
    if os.path.isfile(dirname):
        filelist.append(dirname)
    else:
        for root, dirs, files in os.walk(dirname):
            for dir in dirs:
                filelist.append(os.path.join(root, dir))
            for name in files:
                filelist.append(os.path.join(root, name))
    print filelist
    zf = zipfile.ZipFile(zipfname, 'w', zipfile.zlib.DEFLATED)
    for tar in filelist:
        arcname = tar[len(dirname):]
        zf.write(tar, arcname)
    zf.close()


def git_file_copy(src, delimiter, dest):
    _path = os.path.join(delimiter, src.split(delimiter)[1])
    _path = dest + _path
    if not os.path.exists(os.path.dirname(_path)):
        os.makedirs(os.path.dirname(_path))
    shutil.copy(src, _path)







































