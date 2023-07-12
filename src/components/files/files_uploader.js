import React, {Component} from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import {firebaseConnect} from "react-redux-firebase";
import {injectIntl, intlShape} from "react-intl";
import PropTypes from 'prop-types'
import Upload from "../uielements/upload"
import Button from "../uielements/button"
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';

class FilesUploader extends React.Component {
    state = {
        fileList: [],
        uploading: false,
        clickUpload: false,
        initialFiles: [],
        ready: false
    };

    static propTypes = {
        firebase: PropTypes.object,
        companyId: PropTypes.string,
    }

    componentDidMount() {

        if (this.props.initialFiles){
            this.setDefaultFiles(this.props.initialFiles || [])
        }else{
            this.setState({ready: true})
        }
    }

    componentDidUpdate(prevProps) {
        if ( this.props.clickUpload != prevProps.clickUpload){
            this.setState({clickUpload:this.props.clickUpload})
        }
    }

    setDefaultFiles(initialFiles=[]){
        Promise.all(this.props.initialFiles.map(async (initialFile)=> {
            return {
                uid: initialFile.full_path,
                name: initialFile.file_name || "",
                status: 'done',
                url: await this.getFileUrl(initialFile.full_path),
            }
        })).then((initialFiles) => {
            this.setState({fileList: initialFiles, initialFiles: initialFiles, ready: true})
        })
    }

    async getFileUrl(refPath){
        try{
            const ref = this.props.firebase.storage().ref(refPath)
            return ref.getDownloadURL()
        }catch (e) {
            console.error(e)
            return ""
        }

    }

    uploadFile = (fileRef) => {
        return fileRef.ref.put(fileRef.file).then((snapshot) => {
                    console.log('One success:')
                }).catch((error) => {
                    console.log('One failed:', error.message)
                });
    }

    removeFile = (fileRef) => {
        return fileRef.ref.delete(fileRef.file).then((snapshot) => {
            console.log('One success:')
        }).catch((error) => {
            console.log('One failed:', error.message)
        });
    }

    // filelist   defaultFile
    //
    // filelist = [a ,b, c, d]
    // defaultlist = [a , c, e]
    // filelist - defaultlist = [b, d]    removed
    // defaultlist - filelist = [e] added

    fileRef = (file={}) =>{
        //  todo :  map  file  to fileRef    check  if file has uid  or if it has name
        //  if it has name build it  using  the companyId/FilePath/file.name
        // let ref = undefined
        const ref = this.props.firebase.storage().ref(file.uid)

        // if (file.status == "done"){
        //     ref = this.props.firebase.storage().ref(file.uid)
        // }else if (file.name){
        //     const companyId = this.props.companyId
        //     const filePath = this.props.filePath || ""
        //     ref = this.props.firebase.storage().ref(`${companyId}/${filePath}/${file.name}`)
        // }
        return {ref: ref, file: file}
    }

    handleUpload = () => {
        const {companyId} = this.props

        if (companyId){
            const fileList = this.state.fileList || []
            const initialFiles = this.state.initialFiles || []
            const fileListRef = fileList.map(this.fileRef);
            const initialFilesRef = initialFiles.map(this.fileRef)

            const fileListRefUID = fileList.map(fileRef => fileRef.uid)
            const initialFilesUID = initialFiles.map(fileRef => fileRef.uid)

            const newFilesRef = fileListRef.filter(f => !initialFilesUID.includes(f.file.uid))
            const removedFilesRef = initialFilesRef.filter(f => !fileListRefUID.includes(f.file.uid))

            // const storageRef = this.props.firebase.storage().ref(companyId);
            // const newFiles = fileList.filter(n => !initialFiles.includes(n))
            // const removedFiles   = initialFiles.filter(n => !fileList.includes(n))

            // const filesRef = fileList.map(file => {
            //     const fileRef = storageRef.child(`${filePath}/${file.name}`);
            //     return {ref: fileRef, file: file}
            // });

            // const newFilesRef = newFiles.map(file => {
            //     const fileRef = storageRef.child(`${filePath}/${file.name}`);
            //     return {ref: fileRef, file: file}
            // });

            // const removedFilesRef = removedFiles.map(file => {
            //     const fileRef = storageRef.child(`${filePath}/${file.name}`);
            //     return {ref: fileRef, file: file}
            // });

            const allFilesRef = []
            newFilesRef.forEach(fileRef => {
                allFilesRef.push({fileRef: fileRef, toAdd: true})
            })

            removedFilesRef.forEach(fileRef => {
                allFilesRef.push({fileRef: fileRef, toRemove: true})
            })

            this.setState({
                uploading: true,
            });

            return Promise.all(
                allFilesRef.map(f => {
                    if (f.toAdd) {
                        this.uploadFile(f.fileRef)
                    }else if (f.toRemove){
                        this.removeFile(f.fileRef)
                    }
                })).then(() => {
                if (typeof this.props.onSuccess == "function"){
                    this.props.onSuccess({filesRef: fileListRef})
                }
                this.setState({uploading: false});
                console.log(`All success`)
            }).then(() => {

            }).catch((error) => {
                this.setState({uploading: false});
                console.log(`Some failed: `, error.message)
            });
        }


    };

    onRemoveFile = (file) => {
        this.setState(state => {
            const index = state.fileList.indexOf(file);
            const newFileList = state.fileList.slice();
            newFileList.splice(index, 1);
            return {
                fileList: newFileList,
            };
        });
    }

    beforeUpload = (file) => {
        const {filePath} = this.props || this.props.companyId || "";
        file.uid = `${filePath}/${file.name}`

        this.setState(state => ({
            fileList: [...state.fileList, file],
        }));
        return false;
    }

    render() {
        const { uploading, fileList, clickUpload, initialFiles, ready} = this.state;

        if (ready) {

            if (clickUpload){
                this.setState({clickUpload: false})
                this.handleUpload().then(()=>{
                }).catch((error) => {
                    console.error(error.message)
                })
            }

            const props = {
                ... this.props,
                defaultFileList: initialFiles,
                onRemove: this.onRemoveFile,
                beforeUpload: this.beforeUpload,
            };

            let uploadButton = ""
            if (this.props.clickUpload == undefined){
                uploadButton =  <Button
                    type="primary"
                    onClick={this.handleUpload}
                    disabled={fileList.length === 0}
                    loading={uploading}
                    style={{ marginTop: 16 }}
                >
                    {uploading ? 'Uploading' : 'Start Upload'}
                </Button>
            }

            return (
                <>
                    <Upload {... props}>
                        <Button icon={<UploadOutlined />}>Select File</Button>
                    </Upload>
                    {uploadButton}
                </>
            );
        }else{
            return ""
        }


   }
}

const mapStateToProps = state => {
    return {
        firebase: state.FB.firebase,
        companyId: state.FB.company.companyId,
    }
}


FilesUploader.propTypes = {
    intl: intlShape.isRequired
}

export default compose(connect(mapStateToProps), firebaseConnect())(injectIntl(FilesUploader))