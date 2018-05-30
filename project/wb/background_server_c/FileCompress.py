# -*- coding:utf-8 -*-

import zipfile
import os

class CompressFile(object):
    """compress file to zip"""
    def __init__(self):
        pass

    def zip_file(self, filelist, zipfname, basedir):
        zf = zipfile.ZipFile(zipfname, 'w', zipfile.zlib.DEFLATED)
        for file in filelist:
            arcname = file[len(basedir):]
            zf.write(file, arcname)
        zf.close()

    def zip_dir(self, dirname, zipfname):
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








































