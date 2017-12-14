import subprocess as sp  # call, Popen, PIPE

cmd = "echo server. | sicstus --nologo --noinfo -l server.pl"
sp.call(cmd, shell=True)