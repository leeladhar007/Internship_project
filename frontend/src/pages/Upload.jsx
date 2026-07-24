import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { apiUpload } from '../api'
import GradientButton from '../components/GradientButton'

// NOTE: this file didn't exist in what you shared (App.jsx imports it, but
// it was never uploaded) - written from scratch to match the rest of the
// app's visual language and api.js's existing apiUpload() contract.
// Double check the accepted extensions below actually match your backend's
// /load_kb allowed-file-types list.
const ACCEPTED = '.pdf,.csv,.xlsx,.txt'

export default function Upload() {
  const [dragOver, setDragOver] = useState(false)
  const [queue, setQueue] = useState([]) // { file, progress, status: 'pending'|'uploading'|'done'|'error', result? }
  const inputRef = useRef(null)

  function addFiles(fileList) {
    const files = Array.from(fileList).map((file) => ({ file, progress: 0, status: 'pending' }))
    setQueue((q) => [...q, ...files])
  }

  function updateItem(index, patch) {
    setQueue((q) => q.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  async function uploadOne(index) {
    const item = queue[index]
    if (!item || item.status !== 'pending') return
    updateItem(index, { status: 'uploading', progress: 0 })
    try {
      const result = await apiUpload(item.file, (pct) => updateItem(index, { progress: pct }))
      const ok = result?.status === 'uploaded successfully'
      updateItem(index, { status: ok ? 'done' : 'error', result })
    } catch (err) {
      updateItem(index, { status: 'error', result: { status: err.message || 'Upload failed' } })
    }
  }

  async function uploadAll() {
    for (let i = 0; i < queue.length; i++) {
      if (queue[i].status === 'pending') {
        // eslint-disable-next-line no-await-in-loop
        await uploadOne(i)
      }
    }
  }

  const pendingCount = queue.filter((q) => q.status === 'pending').length

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="frosted rounded-3xl p-8 shadow-glow"
      >
        <div className="mb-2 flex items-center gap-3">
          <div className="w-9 h-9 pastel-gradient rounded-xl flex items-center justify-center text-white shadow-glow">
            📁
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Upload File</h1>
            <p className="text-xs text-gray-400">Add documents to the AppGallop knowledge base</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Supported: PDF, CSV, XLSX, TXT — up to 10MB each.
        </p>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }}
          onClick={() => inputRef.current?.click()}
          className={`mt-6 border-2 border-dashed rounded-2xl px-8 py-12 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-purple-400 bg-purple-50/60' : 'border-gray-300 hover:border-purple-300 hover:bg-white/40'
          }`}
        >
          <div className="text-3xl mb-2">⬆️</div>
          <p className="font-medium text-gray-700">Drag & drop files here</p>
          <p className="text-sm text-gray-400 mt-1">or click to browse</p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ACCEPTED}
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>

        {queue.length > 0 && (
          <div className="mt-6 space-y-2">
            <AnimatePresence>
              {queue.map((item, i) => (
                <motion.div
                  key={item.file.name + i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/60 border border-gray-200 rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📄</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 truncate">{item.file.name}</p>
                      {item.status === 'uploading' && (
                        <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="h-full pastel-gradient transition-all duration-200"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      )}
                      {item.result && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.status === 'done'
                            ? `${item.result.chunks_added ?? 0} chunks added`
                            : item.result.status}
                        </p>
                      )}
                    </div>
                    {item.status === 'pending' && <span className="text-xs text-gray-400">queued</span>}
                    {item.status === 'uploading' && <span className="text-xs text-gray-400">{item.progress}%</span>}
                    {item.status === 'done' && <span className="text-emerald-500">✅</span>}
                    {item.status === 'error' && <span className="text-red-400">❌</span>}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <GradientButton onClick={uploadAll} disabled={pendingCount === 0} className="mt-4">
              Upload {pendingCount > 0 ? `${pendingCount} file${pendingCount > 1 ? 's' : ''}` : 'queued files'}
            </GradientButton>
          </div>
        )}
      </motion.div>
    </div>
  )
}